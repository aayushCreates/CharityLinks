import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";

const app = express();
dotenv.config();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3030"]
  })
);

app.use(morgan("dev"));

app.use('/api/auth', authRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server is running on the port " + port + "🚀");
});