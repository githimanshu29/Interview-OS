//pdf-> pdf storage --->text --> llm ---> Agent ---->prompt --> data ---> save mongoDB -->redis -----> resume data (score, missing skills, recomended)

import fs from "fs/promises";

// import Resume from "../model/resume.model.js";
import Resume from "../models/resume.model.js";
import extractPdfText from "../config/pdf.js";
import resumeAgent from "../agents/resume.agent.js";

import redis from "../../../shared/redis/redis.js";

export const uploadResume = async (req, res) => {
  try {
    console.log("1️⃣ uploadResume started");
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    console.log("2️⃣ File received:", req.file.path);

    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required",
      });
    }

    console.log("3️⃣ User ID:", userId);

    // -----------------------
    // Extract Resume Text
    // -----------------------

    const resumeText = await extractPdfText(req.file.path);

    console.log("4️⃣ PDF text extracted");
    console.log("Text length:", resumeText?.length);

    // -----------------------
    // AI Resume Analysis
    // -----------------------

    const aiResponse = await resumeAgent(resumeText);

    console.log("5️⃣ AI response received");
    console.log("AI response:", aiResponse);

    const resumeData = JSON.parse(aiResponse);

    // -----------------------
    // MongoDB
    // -----------------------

    let resume = await Resume.findOne({ userId });
    console.log("7️⃣ Existing resume:", !!resume);
    if (resume) {
      Object.assign(resume, {
        ...resumeData,
        extractedText: resumeText,
      });

      await resume.save();
      console.log("8️⃣ Existing resume updated");
    } else {
      resume = await Resume.create({
        userId,
        extractedText: resumeText,
        ...resumeData,
      });
      console.log("8️⃣ New resume created");
    }

    // -----------------------
    // Redis
    // -----------------------
    console.log("9️⃣ Saving to Redis");
    await redis.set(`resume:${userId}`, JSON.stringify(resume));

    console.log("🔟 Redis saved");

    await fs.unlink(req.file.path); // deleting pdf
    console.log("1️⃣1️⃣ PDF deleted");

    // -----------------------
    // Response
    // -----------------------

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: resume,
    });
  } catch (error) {
    console.error("🔥 RESUME UPLOAD ERROR");
    console.error(error);
    console.error("MESSAGE:", error.message);
    console.error("STACK:", error.stack);

    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("PDF delete error:", unlinkError.message);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getResume = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    // -------------------------
    // Check Redis
    // -------------------------

    const cache = await redis.get(`resume:${userId}`);

    if (cache) {
      return res.status(200).json({
        success: true,
        source: "redis",
        data: JSON.parse(cache),
      });
    }

    // -------------------------
    // MongoDB
    // -------------------------

    const resume = await Resume.findOne({ userId });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // -------------------------
    // Update Redis
    // -------------------------

    await redis.set(`resume:${userId}`, JSON.stringify(resume));

    return res.status(200).json({
      success: true,
      source: "mongodb",
      data: resume,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
