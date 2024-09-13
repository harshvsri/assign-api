import { Router } from "express";
import studentAuthRouter from "./studentAuth";
import teacherAuthRouter from "./teacherAuth";
import { refreshToken } from "../utils/refreshToken";

const authRouter = Router();

authRouter.use("/student", studentAuthRouter);
authRouter.use("/teacher", teacherAuthRouter);
authRouter.post("/refresh", refreshToken);

export default authRouter;
