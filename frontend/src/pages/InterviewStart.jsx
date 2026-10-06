import React from "react";
import Step1setup from "../components/interview/Step1setup";

function InterviewStart({ user, setUser }) {
  return <Step1setup user={user} setUser={setUser} />;
}

export default InterviewStart;
