import { body, query, validationResult } from "express-validator";
import prisma from "../prisma";
import { SubjectCode } from "@prisma/client";

export const validateStudentSignup = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  async (req, res, next) => {
    const { email } = req.body;
    const student = await prisma.student.findUnique({
      where: { email },
    });
    if (student) {
      return res.status(400).json({
        errors: [{ msg: "Email already taken" }],
      });
    }
    next();
  },
];

export const validateStudentSignin = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateTeacherSignup = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("subjectCode").notEmpty().withMessage("Subject code is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  (req, res, next) => {
    const { subjectCode } = req.body;
    if (!Object.values(SubjectCode).includes(subjectCode)) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid subject code" }] });
    }
    next();
  },
];

export const validateTeacherSignin = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateAssignment = [
  (req, res, next) => {
    const { role } = req.user;
    if (role !== "TEACHER") {
      return res.status(403).json({ errors: [{ msg: "Not authorized" }] });
    }
    next();
  },
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("dueDate").isDate().withMessage("Invalid due date"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateStudent = [
  query("id").isString().withMessage("Invalid student id"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateTeacher = [
  query("id").isString().withMessage("Invalid teacher id"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
