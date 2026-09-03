import express from "express";
import dotenv from "dotenv";
dotenv.config();
import dns from "dns";
import { connectDb } from "./configs/db.js";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 6001;

app.get("/", (req, res) => {
  res.send("Hello from Auth");
});

app.use("/", authRouter);

app.listen(PORT, () => {
  console.log(`AUTH service started & Port is running on: ${PORT}`);
  connectDb();
});
