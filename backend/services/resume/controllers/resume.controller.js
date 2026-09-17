//pdf-> pdf storage --->text --> llm ---> Agent ---->prompt --> data ---> save mongoDB -->redis -----> resume data (score, missing skills, recomended)

import fs from "fs/promises";

import Resume from "../model/resume.model.js";
import extractPdfText from "../config/pdf.js";
import resumeAgent from "../agents/resume.agent.js";

import redis from "../../../shared/redis/redis.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required",
      });
    }

    // -----------------------
    // Extract Resume Text
    // -----------------------

    const resumeText = await extractPdfText(req.file.path);

    // -----------------------
    // AI Resume Analysis
    // -----------------------

    const aiResponse = await resumeAgent(resumeText);

    const resumeData = JSON.parse(aiResponse);

    // -----------------------
    // MongoDB
    // -----------------------

    let resume = await Resume.findOne({ userId });

    if (resume) {
      Object.assign(resume, {
        ...resumeData,
        extractedText: resumeText,
      });

      await resume.save();
    } else {
      resume = await Resume.create({
        userId,
        extractedText: resumeText,
        ...resumeData,
      });
    }

    // -----------------------
    // Redis
    // -----------------------

    await redis.set(`resume:${userId}`, JSON.stringify(resume));

    await fs.unlink(req.file.path); // deleting pdf

    // -----------------------
    // Response
    // -----------------------

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: resume,
    });
  } catch (error) {
    console.log(error);

    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch {}
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
