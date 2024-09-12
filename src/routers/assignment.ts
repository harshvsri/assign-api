import { Router } from "express";
import prisma from "../prisma";
import { stringToCourse, stringToBranch, stringToYear } from "../utils/enums";
import { validateAssignment } from "../utils/validation";

const assignmentRouter = Router();

assignmentRouter.post(
  "/teacher/create",
  validateAssignment,
  async (req, res) => {
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
  }
);

assignmentRouter.get("/teacher/all", async (req, res) => {
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

assignmentRouter.get("/student/all", async (req, res) => {
  const { id } = req.user;

  const studentAssignments = await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      assignments: true,
    },
  });
  if (!studentAssignments) {
    return res.status(404).json({ errors: [{ msg: "No assignments found" }] });
  }
  res.status(200).json({ data: { studentAssignments } });
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
