import { Router } from "express";
import prisma from "../prisma";
import { stringToCourse, stringToBranch, stringToYear } from "../utils/enums";
import {
  validateAssignment,
  validateStudent,
  validateTeacher,
} from "../utils/validation";

const assignmentRouter = Router();

assignmentRouter.post("/", validateAssignment, async (req, res) => {
  const { id } = req.user;
  const { title, description, dueDate } = req.body;
  const [course, branch, year] = [
    stringToCourse(req.body.course || "BTECH"),
    stringToBranch(req.body.branch || "CSE"),
    stringToYear(req.body.year || "YEAR_4"),
  ];

  const students = await prisma.student.findMany({
    where: {
      course,
      branch,
      year,
    },
  });

  const assignment = await prisma.assignment.create({
    data: {
      title,
      description,
      dueDate: new Date(dueDate),
      teacherId: id,
      students: {
        connect: students.map((student) => ({
          id: student.id,
        })),
      },
    },
  });
  res.status(201).json({ data: { assignment } });
});

assignmentRouter.get("/teacher", validateTeacher, async (req, res) => {
  const { id } = req.query;
  const teacher = await prisma.teacher.findUnique({
    where: {
      id,
    },
    include: {
      assignments: true,
    },
  });
  if (!teacher) {
    return res.status(404).json({ errors: [{ msg: "No such teacher found" }] });
  }
  res.status(200).json({ assignments: teacher.assignments });
});

assignmentRouter.get("/student", validateStudent, async (req, res) => {
  const { id } = req.query;
  const student = await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      assignments: true,
    },
  });
  res.status(200).json({ assignments: student.assignments });
});

export default assignmentRouter;
