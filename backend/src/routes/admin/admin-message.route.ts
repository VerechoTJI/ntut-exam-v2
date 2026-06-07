import { Router } from "express";
import { AdminMessageController } from "../../controllers/admin/admin-message.controller";

const adminMessageRouter = Router();

adminMessageRouter.post("/", AdminMessageController.broadcastMessage);

export default adminMessageRouter;
