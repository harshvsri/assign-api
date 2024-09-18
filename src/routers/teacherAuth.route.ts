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
      subjectCode,
    },
  });

  const { accessToken, refreshToken } = createTokens(teacher);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({ accessToken });
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

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({ accessToken });
});

export default teacherAuthRouter;
