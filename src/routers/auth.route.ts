import { Router } from "express";
import studentAuthRouter from "./studentAuth.route";
import teacherAuthRouter from "./teacherAuth.route";
import { refreshToken } from "../utils/refreshToken";
import { protectedRoute } from "../utils/auth";

const authRouter = Router();

authRouter.use("/student", studentAuthRouter);
authRouter.use("/teacher", teacherAuthRouter);
authRouter.post("/refresh", protectedRoute, refreshToken);

export default authRouter;
