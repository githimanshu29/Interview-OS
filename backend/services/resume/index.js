import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDb } from "./config/db.js";
import resumeRouter from "./routes/resume.router.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 6002;

app.get("/", (req, res) => {
  res.send("Hello from Resume-Services");
});
app.use("/", resumeRouter);

app.listen(PORT, () => {
  console.log(`Resume service started & Port is running on: ${PORT}`);
  connectDb();
});
