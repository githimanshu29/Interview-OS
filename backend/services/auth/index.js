import express from "express";
import dotenv from "dotenv";
dotenv.config();
import dns from "dns";
import { connectDb } from "./configs/db.js";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const PORT = process.env.PORT || 6001;

app.get("/", (req, res) => {
  res.send("Hello from Auth");
});

app.listen(PORT, () => {
  console.log(`AUTH service started & Port is running on: ${PORT}`);
  connectDb();
});
