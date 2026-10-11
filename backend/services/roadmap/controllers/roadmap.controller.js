import redis from "../../../shared/redis/redis.js";
import graph from "../graph/roadmap.graph.js";

import Roadmap from "../model/roadmap.model.js";

export const generateRoadmap = async (req, res) => {
  try {
    const { role, targetPackage, useResume = false, resume } = req.body;

    const userId = req.headers["x-user-id"];

    if (!role || !targetPackage) {
      return res.status(400).json({
        success: false,
        message: "Role and Target Package are required.",
      });
    }

    if (useResume && !resume) {
      return res.status(400).json({
        success: false,
        message: "Resume data is required.",
      });
    }

    const result = await graph.invoke({
      role,
      targetPackage,
      useResume,
      resume,
    });

    const roadmap = await Roadmap.create({
      userId,
      ...result.roadmap,
    });

    // Single roadmap cache

    await redis.set(
      `roadmap:${roadmap._id}`,
      JSON.stringify(roadmap),
      "EX",
      60 * 60,
    );

    // Delete history cache

    await redis.del(`userRoadmaps:${userId}`);

    return res.status(201).json({
      success: true,
      message: "Roadmap generated successfully.",
      data: roadmap,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllRoadmaps = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    const cache = await redis.get(`userRoadmaps:${userId}`);

    if (cache) {
      return res.json({
        success: true,
        data: JSON.parse(cache),
      });
    }

    const roadmaps = await Roadmap.find({ userId }).sort({
      createdAt: -1,
    });

    await redis.set(
      `userRoadmaps:${userId}`,
      JSON.stringify(roadmaps),
      "EX",
      60 * 60,
    );

    return res.json({
      success: true,
      data: roadmaps,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];

    const cache = await redis.get(`roadmap:${id}`);

    if (cache) {
      return res.json({
        success: true,
        fromCache: true,
        data: JSON.parse(cache),
      });
    }

    const roadmap = await Roadmap.findOne({
      _id: id,
      userId: userId,
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    await redis.set(`roadmap:${id}`, JSON.stringify(roadmap), "EX", 60 * 60);

    return res.json({
      success: true,
      fromCache: false,
      data: roadmap,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
