import { Router } from "express";
import { AdminExamStateController } from "../../controllers/admin/admin-exam-state.controller";

const adminExamStateRouter = Router();

adminExamStateRouter.get("/", AdminExamStateController.getState);
adminExamStateRouter.post("/", AdminExamStateController.changeState);

export default adminExamStateRouter;
