import { Router } from "express";
import userAuthRouter from "./user-auth.route";
import userExamRouter from "./user-exam.route";
import userLogRouter from "./user-log.route";
import userSubmissionRouter from "./user-submission.route";
import { loadTestIpMockMiddleware } from "../../middlewares/load-test-ip-mock.middleware";

const userRouter = Router();

// Mount authentication and exam interaction sub-routers
userRouter.use(loadTestIpMockMiddleware);
userRouter.use("/auth", userAuthRouter);
userRouter.use("/exam", userExamRouter);
userRouter.use("/log", userLogRouter);
userRouter.use("/submissions", userSubmissionRouter);

export default userRouter;
