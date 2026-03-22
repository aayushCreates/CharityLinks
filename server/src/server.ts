import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import charityRouter from "./routes/charity.routes";
import scoreRouter from "./routes/score.routes";
import drawRouter from "./routes/draw.routes";
import subscriptionRouter from "./routes/subscription.routes";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:3030"],
    credentials: true
  })
);

app.use(cookieParser());

// Stripe Webhook needs raw body, we register it BEFORE express.json()
// subscriptionRouter already uses express.raw() for the /webhook endpoint
app.use("/api/subscriptions", subscriptionRouter);

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/charities", charityRouter);
app.use("/api/scores", scoreRouter);
app.use("/api/draws", drawRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server is running on the port " + port + "🚀");
});
