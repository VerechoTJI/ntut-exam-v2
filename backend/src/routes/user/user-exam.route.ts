import { Router } from "express";
import { UserController } from "../../controllers/user/user.controller";
import { decryptAndVerifyDeviceSession } from "../../middlewares/user-crypto.middleware";

const userExamRouter = Router();

// Secure exam config retrieval, protected by GCM encryption and session tokens
userExamRouter.post("/config", decryptAndVerifyDeviceSession, UserController.getConfig);

export default userExamRouter;
