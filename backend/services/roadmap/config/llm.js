import dotenv from "dotenv";
dotenv.config();

import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0.2,
  maxTokens: 4000,
  maxRetries: 2,
});

export default llm;
