import { Router } from "express";
import assignmentRouter from "./assignment.route";

const apiRouter = Router();

apiRouter.use("/assignment", assignmentRouter);

export default apiRouter;
