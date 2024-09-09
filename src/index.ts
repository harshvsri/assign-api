import "dotenv/config";
import express from "express";
import morgan from "morgan";
import indexRouter from "./routers";
import authRouter from "./routers/auth";
import assignmentRouter from "./routers/assignment";
import { protectedRoute } from "./utils/auth";
import { handleError } from "./utils/error";
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/assignment", protectedRoute, assignmentRouter);

app.use(handleError);
app.listen(PORT, () => {
  console.log(`[server] running at http://localhost:${PORT}`);
});