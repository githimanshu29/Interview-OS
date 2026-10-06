
import Interview from "../model/interview.model.js";
import graph from "../graph/graph.js";
import redis from "../../../shared/redis/redis.js";


export const startInterview = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    const { type, role, useResume = false, resume = {} } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!type || !role) {
      return res.status(400).json({
        success: false,
        message: "Interview type and role are required",
      });
    }

    // -----------------------------
    // LangGraph
    // -----------------------------

    const result = await graph.invoke({
      action: "start",

      type,

      role,

      useResume,

      resume,
    });

    const questions = result.questions;

    if (!questions || questions.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate interview questions",
      });
    }

    // -----------------------------
    // Create Interview
    // -----------------------------

    const interview = await Interview.create({
      userId,

      type,

      role,

      useResume,

      questions,

      currentQuestion: 0,

      status: "in-progress",
    });

    await redis.del(`interviews:${userId}`);

    // -----------------------------
    // Response
    // -----------------------------

    return res.status(201).json({
      success: true,

      interviewId: interview._id,

      currentQuestion: 0,

      totalQuestions: interview.questions.length,

      question: interview.questions[0],
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
