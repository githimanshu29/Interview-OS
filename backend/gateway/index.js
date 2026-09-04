import express from "express";
import dotenv from "dotenv";
dotenv.config();
import proxy from "express-http-proxy";
// import dns from "dns";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { getCurrentUser } from "./controllers/user.controller.js";
import { isAuth } from "./middleware/isAuth.js";
// import { proxyWithUser } from "./utils/proxyWithHeaders.js";
// dns.setServers(["1.1.1.1", "8.8.8.8"]);
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // to acces cookies etc...
  }),
);

app.use(morgan("dev"));

app.use(cookieParser());

const PORT = process.env.PORT || 5000;
app.use(express.json());

app.get("/", (req, res) => {
  return res.send(`hello from Server`);
});

// accessing this  service using proxy
app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL));

app.get("/api/me", isAuth, getCurrentUser);

// app.use(
//   "/api/interview",
//   isAuth,
//   proxyWithUser(process.env.INTERVIEW_SERVICE_URL),
// );

// app.use("/api/resume", isAuth, proxyWithUser(process.env.RESUME_SERVICE_URL));

// app.use("/api/roadmap", isAuth, proxyWithUser(process.env.ROADMAP_SERVICE_URL));

// app.use("/api/billing", isAuth, proxyWithUser(process.env.BILLING_SERVICE_URL));

app.listen(PORT, () => {
  console.log(`Gateway Started on ${PORT}`);
});
