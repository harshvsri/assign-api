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
        ],
      },
      assignment: {
        description: "Assignment management endpoints",
        subroutes: [
          {
            path: "/assignment",
            method: "GET",
            description: "Get all assignments",
          },
          {
            path: "/assignment",
            method: "POST",
            description: "Create a new assignment",
          },
          {
            path: "/assignment/:id",
            method: "GET",
            description: "Get a specific assignment",
          },
          {
            path: "/assignment/:id",
            method: "PUT",
            description: "Update an assignment",
          },
          {
            path: "/assignment/:id",
            method: "DELETE",
            description: "Delete an assignment",
          },
        ],
      },
    },
    creator: "Harsh V Srivastava",
  });
});

export default indexRouter;
