import upload from "../middleware/multer.js";
import { getResume, uploadResume } from "../controllers/resume.controller.js";
import express from "express"

const resumeRouter= express.Router();

resumeRouter.post("upload", upload.single("resume"), uploadResume);

resumeRouter.get("/get-resume", getResume);
export default resumeRouter;