import "dotenv/config";
import express from "express";
import morgan from "morgan";
import authRouter from "./routers/auth";
import assignmentRouter from "./routers/assignment";
import { protectedRoute } from "./utils/auth";
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Hello World" });
});
app.use("/auth", authRouter);
app.use("/assignment", protectedRoute, assignmentRouter);

app.listen(PORT, () => {
  console.log(`[server] running at http://localhost:${PORT}`);
});