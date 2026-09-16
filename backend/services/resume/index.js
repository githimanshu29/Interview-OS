import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDb } from "./config/db.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 6001;

app.get("/", (req, res) => {
  res.send("Hello from Resume-Services");
});

app.listen(PORT, () => {
  console.log(`Resume service started & Port is running on: ${PORT}`);
  connectDb();
});
