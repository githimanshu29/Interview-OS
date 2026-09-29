import React, { useState } from "react";
import initialData from "../components/resume/initialData.js";
import ResumeForm from "../components/resume/ResumeForm";

function ResumeBuilder({ user, setUser }) {
  const [data, setData] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(1);
  return (
    <div className="min-h-screen max-w-2xl w-full mx-auto mt-5">
      <ResumeForm step={currentStep} data={data} setData={setData} />
    </div>
  );
}

export default ResumeBuilder;
