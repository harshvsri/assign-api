import { Router } from "express";
import prisma from "../prisma";
import { comparePassword, createJWT, hashPassword } from "../utils/auth";
import {
  validateStudentSignup,
  validateStudentSignin,
  validateTeacherSignup,
  validateTeacherSignin,
} from "../utils/validation";

const authRouter = Router();

authRouter.post("/student/signup", validateStudentSignup, async (req, res) => {
  const { name, email, password } = req.body;
  const student = await prisma.student.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
    },
  });

  const token = createJWT(student);
  res.status(201).json({
    data: {
      token,
      student: { id: student.id, name: student.name, email: student.email },
    },
  });
});

authRouter.post("/student/signin", validateStudentSignin, async (req, res) => {
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

  const token = createJWT(student);
  res.status(200).json({
    data: {
      token,
      student: { id: student.id, name: student.name, email: student.email },
    },
  });
});

authRouter.post("/teacher/signup", validateTeacherSignup, async (req, res) => {
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
  res.status(201).json({
    data: {
      token,
      teacher: { id: teacher.id, name: teacher.name, email: teacher.email },
    },
  });
});

authRouter.post("/teacher/signin", validateTeacherSignin, async (req, res) => {
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

  const token = createJWT(teacher);
  res.status(200).json({
    data: {
      token,
      teacher: { id: teacher.id, name: teacher.name, email: teacher.email },
    },
  });
});

export default authRouter;
