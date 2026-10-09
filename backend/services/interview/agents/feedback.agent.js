import llm from "../config/llm.js";
import feedbackPrompt from "../prompts/feedback.prompt.js";
// import hrInterviewPrompt from "../prompts/hrInterviewPrompt.js";
// import technicalInterviewPrompt from "../prompts/technicalInterviewPrompt.js";

export default async function feedbackAgent(data) {
  try {
    const prompt = feedbackPrompt(data);

    const response = await llm.invoke(prompt);

    const cleaned = response.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.log("FeedBack Agent Parse Error");
    console.log(response.content);

    throw new Error("Failed to generate feedback questions.");
  }
}
