import { Request, Response, NextFunction } from "express";
import { createMessage, MessageType } from "../../services/message.service";
import MessageSocketService from "../../sockets/message-socket.service";
import { HttpError } from "../../utils/http-error";

export class AdminMessageController {
  /**
   * POST /admin/messages
   * Broadcast a notification message to all students.
   */
  static async broadcastMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { message } = req.body;
      if (!message) {
        throw new HttpError(400, "Bad Request: Missing message text");
      }

      const msg = await createMessage(MessageType.NOTIFICATION, message);
      
      MessageSocketService.sendMessage({
        id: msg.id,
        type: msg.type,
        message: msg.message,
      });

      res.status(200).json({
        success: true,
        message: "Message broadcast successfully",
        data: msg
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AdminMessageController;
