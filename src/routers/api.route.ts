import { Router } from "express";
import assignmentRouter from "./assignment.route";
import studentRouter from "./student.route";
import teacherRouter from "./teacher.route";

const apiRouter = Router();

apiRouter.use("/assignment", assignmentRouter);
apiRouter.use("/student", studentRouter);
apiRouter.use("/teacher", teacherRouter);

export default apiRouter;
