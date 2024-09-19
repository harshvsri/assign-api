import { Router } from "express";
import prisma from "../prisma";
import { validateStudent } from "../utils/validation";

const studentRouter = Router();

studentRouter.get("/", validateStudent, async (req, res) => {
  const { id } = req.query;
  const student = await prisma.student.findUnique({
    where: {
      id,
    },
  });

  if (!student) {
    return res.status(404).json({ errors: [{ msg: "No student found" }] });
  }

  res.status(200).json({ student });
});

export default studentRouter;
