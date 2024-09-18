import { Router } from "express";
import prisma from "../prisma";
import { stringToCourse, stringToBranch, stringToYear } from "../utils/enums";
import { validateAssignment } from "../utils/validation";

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

assignmentRouter.get("/teacher", async (req, res) => {
  const { id } = req.user;
  const assignments = await prisma.assignment.findMany({
    where: {
      teacherId: id,
    },
  });
  if (!assignments) {
    return res.status(404).json({ errors: [{ msg: "No assignments found" }] });
  }
  res.status(200).json({ data: { assignments } });
});

assignmentRouter.get("/student", async (req, res) => {
  const { id } = req.user;

  const studentDataWithAssignments = await prisma.student.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      course: true,
      year: true,
      branch: true,
      assignments: {
        select: {
          id: true,
          title: true,
          description: true,
          dueDate: true,
          teacher: {
            select: {
              name: true,
            },
          },
          problems: {
            select: {
              id: true,
              title: true,
              difficulty: true,
              description: true,
            },
          },
        },
      },
    },
  });
  if (!studentDataWithAssignments) {
    return res.status(404).json({ errors: [{ msg: "No assignments found" }] });
  }
  res.status(200).json({ studentDataWithAssignments });
});

assignmentRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const assignment = await prisma.assignment.findUnique({
    where: {
      id,
    },
  });
  if (!assignment) {
    return res.status(404).json({ errors: [{ msg: "Assignment not found" }] });
  }
  res.status(200).json({ data: { assignment } });
});

export default assignmentRouter;
