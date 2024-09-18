import { Router } from "express";
import prisma from "../prisma";
import { comparePassword, createTokens, hashPassword } from "../utils/auth";
import {
  validateStudentSignup,
  validateStudentSignin,
} from "../utils/validation";

const studentAuthRouter = Router();

studentAuthRouter.post("/signup", validateStudentSignup, async (req, res) => {
  const { name, email, password } = req.body;
  const student = await prisma.student.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
    },
  });

  const { accessToken, refreshToken } = createTokens(student);

  res.status(201).json({ accessToken, refreshToken });
});

studentAuthRouter.post("/signin", validateStudentSignin, async (req, res) => {
  const { email, password } = req.body;

  const student = await prisma.student.findUnique({
    where: {
      email,
    },
  });
  if (!student) {
    return res.status(404).json({
      errors: [{ msg: "Email not found" }],
    });
  }

  const match = await comparePassword(password, student.password);
  if (!match) {
    return res.status(404).json({
      errors: [{ msg: "Wrong password" }],
    });
  }

  const { accessToken, refreshToken } = createTokens(student);

  res.status(200).json({ accessToken, refreshToken });
});

export default studentAuthRouter;
