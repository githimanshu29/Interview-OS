import { START, END, StateGraph } from "@langchain/langgraph";

import InterviewState from "./state.js";

import { interviewNode, feedbackNode, summaryNode } from "./nodes.js";

// -------------------------------------
// Router
// -------------------------------------

function router(state) {
  switch (state.action) {
    case "start":
      return "interviewAgent";

    case "feedback":
      return "feedbackAgent";

    default:
      return END;
  }
}

// -------------------------------------
// Feedback Router
// -------------------------------------

function feedbackRouter(state) {
  if (state.completed) {
    return "summaryAgent";
  }

  return END;
}

// -------------------------------------
// Graph
// -------------------------------------

const graph = new StateGraph(InterviewState)

  // Nodes
  .addNode("interviewAgent", interviewNode)

  .addNode("feedbackAgent", feedbackNode)

  .addNode("summaryAgent", summaryNode)

  // START
  .addConditionalEdges(START, router, {
    interviewAgent: "interviewAgent",
    feedbackAgent: "feedbackAgent",
  })

  // Interview -> END
  .addEdge("interviewAgent", END)

  // Feedback -> Summary OR END
  .addConditionalEdges("feedbackAgent", feedbackRouter, {
    summaryAgent: "summaryAgent",
    [END]: END,
  })

  // Summary -> END
  .addEdge("summaryAgent", END)

  .compile();

export default graph;
