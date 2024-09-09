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
  res.status(201).json({ message: "Assignment created", assignment });

  // Additionally we can send email to all students
});

export default assignmentRouter;
