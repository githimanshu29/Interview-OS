import llm from "../config/llm.js";
import summaryPrompt from "../prompts/summary.prompt.js";

export default async function summaryAgent(data) {
  const prompt = summaryPrompt(data);

  const response = await llm.invoke(prompt);

  try {
    const cleaned = response.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.log("Summary Agent Parse Error");

    console.log(response.content);

    throw new Error("Failed to generate interview summary.");
  }
}
