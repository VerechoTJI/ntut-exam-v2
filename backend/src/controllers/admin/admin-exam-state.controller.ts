import { Request, Response, NextFunction } from "express";
import { ExamStateService, ExamState } from "../../services/exam-state.service";
import { HttpError } from "../../utils/http-error";

export class AdminExamStateController {
  /**
   * POST /admin/exam-state
   * Update the global exam state.
   */
  static async changeState(req: Request, res: Response, next: NextFunction) {
    try {
      const { state } = req.body;
      
      if (!state || !Object.values(ExamState).includes(state)) {
        throw new HttpError(400, "Bad Request: Invalid or missing state");
      }

      await ExamStateService.changeState(state as ExamState);
      
      res.status(200).json({
        success: true,
        message: `Exam state successfully changed to ${state}`,
        state: state
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /admin/exam-state
   * Get the current global exam state.
   */
  static async getState(req: Request, res: Response, next: NextFunction) {
    try {
      const state = await ExamStateService.getCurrentState();
      
      res.status(200).json({
        success: true,
        state: state
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AdminExamStateController;
