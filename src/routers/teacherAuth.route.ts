import { Router } from "express";
import prisma from "../prisma";
import { comparePassword, createTokens, hashPassword } from "../utils/auth";
import {
  validateTeacherSignup,
  validateTeacherSignin,
} from "../utils/validation";
const teacherAuthRouter = Router();

teacherAuthRouter.post("/signup", validateTeacherSignup, async (req, res) => {
  const { name, email, password, subjectCode } = req.body;
  const teacher = await prisma.teacher.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
    },
  });

  const { accessToken, refreshToken } = createTokens(teacher);

  res.status(201).json({ accessToken, refreshToken });
});

teacherAuthRouter.post("/signin", validateTeacherSignin, async (req, res) => {
  const { email, password } = req.body;

  const teacher = await prisma.teacher.findUnique({
    where: {
      email,
    },
  });
  if (!teacher) {
    return res.status(404).json({
      errors: [{ msg: "Email not found" }],
    });
  }

  const match = await comparePassword(password, teacher.password);
  if (!match) {
    return res.status(404).json({
      errors: [{ msg: "Wrong password" }],
    });
  }

  const { accessToken, refreshToken } = createTokens(teacher);

  res.status(200).json({ accessToken, refreshToken });
});

export default teacherAuthRouter;
