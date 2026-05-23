import express from "express";
import authRouter from "./src/modules/auth/auth.routes.js";
import { errorMiddleware } from "./src/shared/middleware/error.middleware.js";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.json({ status: "ok", app: "Avicana API " }));

app.use("/api/auth", authRouter);

app.use(errorMiddleware);

export default app;
