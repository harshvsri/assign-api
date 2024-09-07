import { Router } from "express";
import prisma from "../prisma";
import { Course, Branch, Year } from "@prisma/client";

const assignmentRouter = Router();

assignmentRouter.post("/", async (req, res) => {
  const { id, role } = req.user;
  if (role !== "TEACHER") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const { title, content, type } = req.body;
  const dueDate = new Date(req.body.dueDate);
  const [course, branch, year] = [Course.BTECH, Branch.CSE, Year.YEAR_4];

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
      content,
      type,
      dueDate,
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
