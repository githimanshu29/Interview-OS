import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import llm from "../config/llm.js";
import searchVideo from "../config/youtube.js";

const resourceAgent = async (state) => {
  try {
    const roadmap = state.roadmap;

    // ----------------------------------
    // Get all module titles
    // ----------------------------------

    const moduleTitles = roadmap.modules
      .map((module) => module.title)
      .join("\n");

    // ----------------------------------
    // Single Groq Call
    // ----------------------------------

    const docsResponse = await llm.invoke([
      new SystemMessage(`
You are an expert software engineer.

For every module below return the official documentation.

Rules:

1. Prefer official documentation.
2. If official documentation does not exist, return the best learning article.
3. Return ONLY valid JSON.
4. Do not explain anything.
5. Keep the same title.

Return format:

[
  {
    "title":"",
    "article":""
  }
]
`),

      new HumanMessage(`
Modules:

${moduleTitles}
`),
    ]);

    let docs = [];

    try {
      docs = JSON.parse(
        docsResponse.content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim(),
      );
    } catch {
      docs = [];
    }

    // ----------------------------------
    // Create Docs Map
    // ----------------------------------

    const docsMap = new Map();

    docs.forEach((item) => {
      docsMap.set(item.title.toLowerCase(), item.article);
    });

    // ----------------------------------
    // Parallel YouTube Search
    // ----------------------------------

    roadmap.modules = await Promise.all(
      roadmap.modules.map(async (module) => {
        let video = null;

        try {
          video = await searchVideo(module.title);
        } catch (err) {
          console.log(err.message);
        }

        return {
          ...module,

          youtube: video?.url || "",

          article: docsMap.get(module.title.toLowerCase()) || "",
        };
      }),
    );

    return {
      ...state,

      roadmap,
    };
  } catch (error) {
    console.log(error);

    return state;
  }
};

export default resourceAgent;
