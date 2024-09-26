import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import indexRouter from "./routers/index.route";
import authRouter from "./routers/auth.route";
import apiRouter from "./routers/api.route";
import { protectedRoute } from "./utils/auth";
import { handleError } from "./utils/error";
import { corsOptions } from "./utils/config";
import checkDbConnection from "./checkDb";
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors(corsOptions));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/api", protectedRoute, apiRouter);

app.use(handleError);
app.listen(PORT, () => {
  console.log(`[server] running at http://localhost:${PORT}`);
  checkDbConnection();
});
