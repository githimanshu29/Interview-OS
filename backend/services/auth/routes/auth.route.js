import express from "express";
import {
  addInterviewCoins,
  //   addCoins,
  login,
  logout,
  useInterviewCoins,
  //   useInterviewCoins,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", login);

authRouter.get("/logout", logout);

// authRouter.post("/add-coins",addCoins)

authRouter.post("/use-interview-coins", useInterviewCoins);

authRouter.post("/add-interview-coins", addInterviewCoins);

export default authRouter;
