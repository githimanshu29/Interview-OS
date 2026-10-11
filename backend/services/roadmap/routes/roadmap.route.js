import express from "express";

import {
  generateRoadmap,
  getAllRoadmaps,
  getRoadmapById,
} from "../controllers/roadmap.controller.js";

const roadmapRouter = express.Router();

roadmapRouter.post("/generate", generateRoadmap);

roadmapRouter.get("/", getAllRoadmaps);

roadmapRouter.get("/:id", getRoadmapById);

export default roadmapRouter;
