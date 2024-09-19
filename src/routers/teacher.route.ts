import { Router } from "express";
import prisma from "../prisma";
import { validateTeacher } from "../utils/validation";

const teacherRouter = Router();

teacherRouter.get("/", validateTeacher, async (req, res) => {
  const { id } = req.query;
  const teacher = await prisma.teacher.findUnique({
    where: {
      id,
    },
  });

  if (!teacher) {
    return res.status(404).json({ errors: [{ msg: "No teacher found" }] });
  }
  res.status(200).json({ teacher });
});

export default teacherRouter;
