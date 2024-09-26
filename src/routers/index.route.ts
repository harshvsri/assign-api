import { Router } from "express";

const indexRouter = Router();

indexRouter.get("/", async (req, res) => {
  res.status(200).json({
    projectName: "Assign API",
    description: "An API for managing assignments and authentication",
    version: "1.0.0",
    routes: {
      auth: {
        description: "Authentication endpoints",
        subroutes: [
          {
            path: "/auth/student/signup",
            method: "POST",
            description: "Register a new student",
          },
          {
            path: "/auth/student/signin",
            method: "POST",
            description: "Login student",
          },
          {
            path: "/auth/teacher/signup",
            method: "POST",
            description: "Register a new teacher",
          },
          {
            path: "/auth/teacher/signin",
            method: "POST",
            description: "Login teacher",
          },
          {
            path: "/auth/refresh",
            method: "POST",
            description: "Refresh access token",
          },
        ],
      },
      api: {
        description: "API endpoints",
        subroutes: [
          {
            path: "/api/assignment",
            method: "POST",
            description: "Create a new assignment",
          },
          {
            path: "/api/assignment/teacher?id=teacherId",
            method: "GET",
            description: "Get all assignments created by teacher",
          },
          {
            path: "/api/assignment/student?id=studentId",
            method: "GET",
            description: "Get all assignments of a student",
          },
          {
            path: "/api/student?id=studentId",
            method: "GET",
            description: "Get a specific student by ID",
          },
          {
            path: "/api/teacher?id=teacherId",
            method: "GET",
            description: "Get a specific teacher by ID",
          },
        ],
      },
    },
    creator: "Harsh V Srivastava",
  });
});

export default indexRouter;
