import React, { useState } from "react";
import initialData from "../components/resume/initialData.js";
import ResumeForm from "../components/resume/ResumeForm";
import { motion } from "motion/react";
import { FiArrowLeft, FiArrowRight, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ResumePreview from "../components/resume/ResumePreview.jsx";

// Step config — title + subtitle for each step
const STEPS = [
  {
    step: 1,
    title: "Personal Information",
    subtitle: "Your basic contact details",
  },
  {
    step: 2,
    title: "Professional Summary",
    subtitle: "A quick intro about yourself",
  },
  { step: 3, title: "Skills", subtitle: "Your technical skills" },
  {
    step: 4,
    title: "Work Experience",
    subtitle: "Your past jobs & internships",
  },
  { step: 5, title: "Projects", subtitle: "Projects you have built" },
  { step: 6, title: "Education", subtitle: "Your academic background" },
];

const TOTAL_STEPS = STEPS.length;

function ResumeBuilder({ user, setUser }) {
  const [data, setData] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const progressPct = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  const activeStep = STEPS.find((s) => s.step === currentStep);

  const goNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep(currentStep + 1);
  };

  const goPrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isLastStep = currentStep === TOTAL_STEPS;

  // ── Show Preview Page ──────────────────────────────────────────────────────
  if (showPreview) {
    return (
      <ResumePreview
        data={data}
        user={user}
        setUser={setUser}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] flex flex-col">
      {/* <ResumeForm step={currentStep} data={data} setData={setData} /> */}

      {/* Navbar */}
      <nav className="sticky top-0 z-20 border-b border-black/8 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-3 sm:px-5">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex cursor-pointer items-center gap-1.5"
          >
            <span className="text-base font-extrabold tracking-tight">
              Interview-OS
            </span>

            <span className="hidden rounded bg-black/5 px-1.5 py-0.5 text-[10px] text-black/50 sm:block">
              Resume Builder
            </span>
          </div>

          <button
            onClick={() => setShowPreview(true)}
            className="flex h-8 items-center justify-center gap-2 rounded-lg border border-black/15 text-black/60 transition px-2 hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
          >
            <FiEye size={13} />
          </button>
        </div>
      </nav>

      {/* Main Content */}

      <div className="flex-1 px-3 py-4 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-2xl">
          {/* Step Info */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] text-black/40 font-medium">
                STEP {currentStep} OF {TOTAL_STEPS}
              </p>
              <p className="hidden text-[10px] text-black/40 sm:block">
                {Math.round(progressPct)}% complete
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-black/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0A0A0A] rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Step Title */}
            <div className="mt-3">
              <h1 className="text-xl font-bold sm:text-2xl">
                {activeStep.title}
              </h1>
              <p className="mt-1 text-xs text-black/45 sm:text-sm">
                {activeStep.subtitle}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-black/8 mb-4" />

          {/* Form */}
          <ResumeForm step={currentStep} data={data} setData={setData} />

          {/* Divider */}
          <div className="border-t border-black/8 mt-6 mb-4" />

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <button
              onClick={goPrev}
              disabled={currentStep === 1}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border transition-all
                ${
                  currentStep === 1
                    ? "border-black/8 text-black/25 cursor-not-allowed"
                    : "border-black/20 text-black/60 hover:border-black/40 hover:text-[#0A0A0A]"
                }`}
            >
              <FiArrowLeft size={15} />
              <span className="hidden sm:block">Previous</span>
            </button>

            {/* Step Dots */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((s) => (
                <button
                  key={s.step}
                  onClick={() => setCurrentStep(s.step)}
                  className={`rounded-full transition-all ${
                    s.step === currentStep
                      ? "w-4 h-1.5 bg-[#0A0A0A]"
                      : s.step < currentStep
                        ? "w-1.5 h-1.5 bg-black/35"
                        : "w-1.5 h-1.5 bg-black/12"
                  }`}
                />
              ))}
            </div>

            {/* Next or Preview Button */}
            {isLastStep ? (
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#000000]/90 backdrop-blur-2xl border border-white/10 text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:border-white/20 transition-all"
              >
                <FiEye size={15} />

                <span className="hidden sm:block">Preview Resume</span>
              </button>
            ) : (
              <button
                onClick={goNext}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#000000]/90 backdrop-blur-2xl border border-white/10 text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:border-white/20 transition-all"
              >
                <span className="hidden sm:block">Next</span>

                <FiArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;
