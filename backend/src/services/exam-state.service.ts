import { SystemSettingsService } from "./system-settings.service";
import { createMessage, MessageType } from "./message.service";
import MessageSocketService from "../sockets/message-socket.service";
import logger from "../utils/logger.util";

export enum ExamState {
  UNINITIALIZED = "UNINITIALIZED",
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED"
}

export class ExamStateService {
  /**
   * Get the current exam state. If not set, defaults to UNINITIALIZED.
   */
  static async getCurrentState(): Promise<ExamState> {
    try {
      const state = await SystemSettingsService.getSetting<string>("exam_state");
      if (state && Object.values(ExamState).includes(state as ExamState)) {
        return state as ExamState;
      }
    } catch (error: any) {
      logger.warn(`Failed to retrieve exam_state: ${error.message}`);
    }
    return ExamState.UNINITIALIZED;
  }

  /**
   * Change the current exam state and broadcast the change.
   */
  static async changeState(newState: ExamState): Promise<void> {
    const currentState = await this.getCurrentState();
    if (currentState === newState) {
      return; // No change needed
    }

    // Update in system settings
    try {
      const existing = await SystemSettingsService.getSetting<string>("exam_state");
      if (existing !== null) {
        await SystemSettingsService.updateSetting("exam_state", newState);
      } else {
        await SystemSettingsService.createSetting("exam_state", newState);
      }
      
      // Auto-close device registration when exam starts
      if (newState === ExamState.IN_PROGRESS) {
        await SystemSettingsService.setAllowDeviceRegistration(false);
      }
    } catch (error: any) {
      logger.error(`Failed to update exam_state to ${newState}:`, error);
      throw error;
    }

    // Create a message record for the state change
    const msg = await createMessage(MessageType.EXAM, newState);

    // Broadcast via socket
    MessageSocketService.sendStatusUpdateNotification(msg.id, newState);

    logger.info(`Exam state changed from ${currentState} to ${newState}`);
  }
}
