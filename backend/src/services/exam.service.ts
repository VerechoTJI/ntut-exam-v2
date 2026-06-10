import { SystemSettingsService } from "./system-settings.service";
import { DeviceService } from "./device.service";
import { CryptoService } from "./crypto.service";
import { ReplayProtectionService } from "./replay-protection.service";
import { ExamConfigParserService } from "./exam-config-parser.service";
import { HttpError } from "../utils/http-error";
import { AesEncryptedPayload } from "../types/crypto.type";
import logger from "../utils/logger.util";

export class ExamService {
  static async getSecureConfig(payload: AesEncryptedPayload, decryptedBody?: any): Promise<AesEncryptedPayload> {
    const { device_uuid: deviceUuid } = payload;
    let aesKey: any = null;
    if (process.env.LOAD_TEST_MODE !== 'pure') {
      aesKey = await DeviceService.getAesKey(deviceUuid);
    }

    let decrypted = decryptedBody;
    if (!decrypted) {
      if (process.env.LOAD_TEST_MODE === 'pure') {
        decrypted = payload as unknown as any;
      } else {
        try {
          const plaintext = CryptoService.decryptAESGCM(payload, aesKey);
          decrypted = JSON.parse(plaintext);
        } catch (error: any) {
          throw new HttpError(400, `Failed to decrypt request: ${error.message}`);
        }

        const { timestamp, nonce } = decrypted;
        if (timestamp === undefined || nonce === undefined) {
          throw new HttpError(400, "Missing timestamp or nonce in encrypted payload");
        }
        ReplayProtectionService.verifyAndSaveNonce(nonce, timestamp);
      }
    }

    let sessionToken: string;
    if (process.env.LOAD_TEST_MODE === 'pure' && !decrypted.session_token) {
      // In pure mode, testId may be passed directly if session_token is not
    } else {
      sessionToken = decrypted.session_token;
      if (!sessionToken) {
        throw new HttpError(400, "Missing required session_token in decrypted payload");
      }

      let tokenPayload: any;
      try {
        tokenPayload = CryptoService.verifySessionToken(sessionToken, aesKey);
      } catch (error: any) {
        throw new HttpError(401, `Session validation failed: ${error.message}`);
      }

      if (tokenPayload.deviceUuid !== deviceUuid) {
        throw new HttpError(401, "Security violation: Token device UUID mismatch");
      }
    }

    let configContent = "{}";
    try {
      const config = await ExamConfigParserService.getConfig();
      if (config) {
        configContent = JSON.stringify(config);
      }
    } catch (err: any) {
      logger.warn(`Failed to retrieve exam_config: ${err.message}`);
    }

    const encryptedResult = CryptoService.encryptAESGCM(configContent, aesKey);
    return {
      ...encryptedResult,
      device_uuid: deviceUuid
    };
  }
}
