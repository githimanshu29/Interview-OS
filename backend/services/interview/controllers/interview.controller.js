import Interview from "../models/interview.model.js";
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

export const submitAnswer = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    const { interviewId, answer } = req.body;

    if (!interviewId || !answer) {
      return res.status(400).json({
        success: false,
        message: "Interview Id and Answer are required",
      });
    }

    // -----------------------------------
    // Find Interview
    // -----------------------------------

    const interview = await Interview.findOne({
      _id: interviewId,
      userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // -----------------------------------
    // Already Completed
    // -----------------------------------

    if (interview.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Interview already completed",
      });
    }

    // -----------------------------------
    // Current Question
    // -----------------------------------

    const index = interview.currentQuestion;

    const currentQuestion = interview.questions[index];

    if (!currentQuestion) {
      return res.status(400).json({
        success: false,
        message: "Invalid question index",
      });
    }

    // -----------------------------------
    // Save User Answer
    // -----------------------------------

    currentQuestion.userAnswer = answer;

    // -----------------------------------
    // Check Last Question
    // -----------------------------------

    const completed =
      interview.currentQuestion + 1 >= interview.questions.length;

    // -----------------------------------
    // LangGraph
    // -----------------------------------

    const result = await graph.invoke({
      action: "feedback",

      question: currentQuestion.question,

      answer,

      difficulty: currentQuestion.difficulty,

      completed,

      role: interview.role,

      type: interview.type,

      questions: interview.questions,
    });

    // -----------------------------------
    // Save Feedback
    // -----------------------------------

    currentQuestion.feedback = result.feedback;

    interview.currentQuestion++;

    // -----------------------------------
    // Completed
    // -----------------------------------

    if (completed) {
      interview.status = "completed";

      interview.overallScore = result.report.overallScore;

      interview.summary = result.report.summary;

      interview.strengths = result.report.strengths;

      interview.weaknesses = result.report.weaknesses;

      interview.recommendations = result.report.recommendations;

      await interview.save();

      await redis.del(`interviews:${userId}`);

      return res.status(200).json({
        success: true,

        completed: true,

        interview,
      });
    }

    // -----------------------------------
    // Save Progress
    // -----------------------------------

    await interview.save();

    await redis.del(`interviews:${userId}`);

    return res.status(200).json({
      success: true,

      completed: false,

      currentQuestion: interview.currentQuestion,

      question: interview.questions[interview.currentQuestion],

      feedback: result.feedback,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getInterview = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    const { id } = req.params;

    const interview = await Interview.findOne({
      _id: id,
      userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
