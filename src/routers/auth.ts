import { Router } from "express";
import prisma from "../prisma";
import { comparePassword, createJWT, hashPassword } from "../utils/auth";

const authRouter = Router();

authRouter.post("/student/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const student = await prisma.student.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
    },
  });

  const token = createJWT(student);
  res.status(200).json({ message: "Signup successful", token });
});

authRouter.post("/student/signin", async (req, res) => {
  const { email, password } = req.body;

  const student = await prisma.student.findUnique({
    where: {
      email,
    },
  });
  if (!student) {
    return res.status(404).json({ message: "Email not found" });
  }

  const match = await comparePassword(password, student.password);
  if (!match) {
    return res.status(404).json({ message: "Wrong password" });
  }

  const token = createJWT(student);
  res.status(200).json({ message: "Signin successful", token });
});

authRouter.post("/teacher/signup", async (req, res) => {
  const { name, email, password, subjectCode } = req.body;
  const teacher = await prisma.teacher.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
      subjectCode,
    },
  });

  const token = createJWT(teacher);
  res.status(200).json({ message: "Signup successful", token });
});

authRouter.post("/teacher/signin", async (req, res) => {
  const { email, password } = req.body;

  const teacher = await prisma.teacher.findUnique({
    where: {
      email,
    },
  });
  if (!teacher) {
    return res.status(404).json({ message: "Email not found" });
  }

  const match = await comparePassword(password, teacher.password);
  if (!match) {
    return res.status(404).json({ message: "Wrong password" });
  }

  const token = createJWT(teacher);
  res.status(200).json({ message: "Signin successful", token });
});

export default authRouter;
