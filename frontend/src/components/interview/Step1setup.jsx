import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import axios from "axios";

import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiCheckCircle,
  FiFileText,
  FiUploadCloud,
} from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";

import { setResume } from "../../redux/resumeSlice";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

import { startInterview } from "../../apis/interview.api";
import { useCoins } from "../../apis/user.api";

function Step1SetUp({ user, setUser }) {
  const dispatch = useDispatch();
  const { resume } = useSelector((state) => state.resume);

  const [role, setRole] = useState("");
  const [type, setType] = useState("technical");
  const [useResume, setUseResume] = useState(!!resume);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [starting, setStarting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setUseResume(!!resume);
    if (resume?.role) setRole(resume.role);
  }, [resume]);

  const uploadResume = async () => {
    if (!file) return;
    try {
      setUploading(true);
      const coinResponse = await useCoins({
        coins: 10,
        action: "resume-score",
      });

      setUser((prev) => ({
        ...prev,
        interviewCoin: coinResponse.interviewCoin,
      }));
      const formData = new FormData();
      formData.append("resume", file);
      const response = await api.post("/api/resume/upload", formData);
      dispatch(setResume(response.data.data));
      setUploading(false);
      setFile(null);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const start = async () => {
    setStarting(true);
    const response = await startInterview({ role, type, useResume, resume });

    if (response) {
      const coinResponse = await useCoins({ coins: 50, action: "interview" });

      setUser((prev) => ({
        ...prev,
        interviewCoin: coinResponse.interviewCoin,
      }));
    }
    setStarting(false);
    navigate(`/interview/${response.interviewId}`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-5">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-4xl bg-[#0E1016] border border-white/10 rounded-2xl sm:rounded-[24px] overflow-hidden grid lg:grid-cols-[40%_60%] shadow-[0_0_60px_rgba(255,255,255,.03)]"
      >
        {/* ── LEFT ── */}
        <div className="p-5 sm:p-7 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-start gap-4">
          <div>
            <div
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 cursor-pointer"
            >
              <FiArrowLeft size={12} />
              <span className="text-xs text-zinc-300">Back</span>
            </div>

            <h1 className="mt-4 text-xl sm:text-2xl font-bold text-white leading-snug">
              Welcome back,
              <br />
              {user?.name || "Developer"}
            </h1>

            <p className="mt-2 text-xs sm:text-sm leading-6 text-zinc-400">
              Practice realistic AI interviews, receive instant feedback, and
              improve before your next job interview.
            </p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {[
              "Personalized AI Questions",
              "Resume Based Interview",
              "Detailed Performance Report",
              "Real Interview Experience",
            ].map((item) => (
              <motion.div
                key={item}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3"
              >
                <div className="w-7 h-7 shrink-0 rounded-lg bg-white flex items-center justify-center">
                  <FiCheck className="text-black" size={13} />
                </div>
                <span className="text-xs sm:text-sm text-zinc-300">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="p-5 sm:p-7 flex flex-col">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              Start Interview
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Configure your interview preferences.
            </p>
          </div>

          <div className="mt-5 flex-1 space-y-4 overflow-y-auto">
            {/* Role */}
            <div>
              <label className="text-xs font-medium text-zinc-400">
                Target Role
              </label>
              <div className="mt-1.5 relative">
                <FiBriefcase
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={14}
                />
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Backend Developer"
                  className="w-full h-11 rounded-xl bg-[#17181E] border border-white/10 pl-10 pr-4 text-sm text-white outline-none focus:border-white/30 transition"
                />
              </div>
            </div>

            {/* Interview Type */}
            <div>
              <label className="text-xs font-medium text-zinc-400">
                Interview Type
              </label>
              <div className="mt-1.5 flex rounded-xl bg-[#17181E] p-1 border border-white/10">
                {["technical", "hr"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setType(item)}
                    className={`flex-1 h-9 rounded-lg text-xs sm:text-sm font-medium capitalize transition-all ${
                      type === item
                        ? "bg-white text-black"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Resume Toggle */}
            <div className="rounded-xl border border-white/10 bg-[#17181E] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium text-white">Use Resume</h3>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    AI will personalize questions using your resume.
                  </p>
                </div>
                <button
                  onClick={() => setUseResume(!useResume)}
                  className={`relative shrink-0 w-12 h-7 rounded-full transition ${useResume ? "bg-white" : "bg-zinc-700"}`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 rounded-full bg-black transition-all ${useResume ? "left-6" : "left-0.5"}`}
                  />
                </button>
              </div>
            </div>

            {/* Resume Ready */}
            {resume && useResume && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-green-500/20 bg-green-500/5 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 shrink-0 rounded-lg bg-green-500 flex items-center justify-center">
                    <FiFileText className="text-white" size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white">
                      Resume Ready{" "}
                      {/* <span className="text-gray-400">
                        ({resume?.suggestedRole})
                      </span> */}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Resume detected successfully.
                    </p>
                  </div>
                  <FiCheckCircle
                    className="text-green-400 shrink-0"
                    size={18}
                  />
                </div>
              </motion.div>
            )}

            {/* Upload Resume */}
            {useResume && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border-2 border-dashed border-white/10 bg-[#17181E] p-4"
              >
                <label className="cursor-pointer flex flex-col items-center">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center">
                    <FiUploadCloud className="text-black" size={20} />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-white">
                    Upload Resume
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 text-center">
                    {resume
                      ? "Resume detected. Upload a new resume anytime to update your interview questions."
                      : "Upload your resume to generate personalized interview questions."}
                  </p>
                  <input
                    hidden
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files[0]) setFile(e.target.files[0]);
                    }}
                  />
                </label>

                {file && (
                  <div className="mt-4">
                    <div className="rounded-lg bg-black/20 border border-white/10 p-2.5">
                      <p className="text-xs text-zinc-300 truncate">
                        {file.name}
                      </p>
                    </div>
                    <button
                      onClick={uploadResume}
                      disabled={uploading}
                      className="mt-3 w-full h-10 rounded-xl bg-white text-black text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                    >
                      {uploading ? "Uploading..." : "Upload Resume"}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={!role || starting || (useResume && !resume)}
            onClick={start}
            className="mt-5 h-12 rounded-xl bg-white text-black text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition"
          >
            {starting ? (
              "Starting Interview..."
            ) : (
              <>
                Start Interview <FiArrowRight size={15} />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default Step1SetUp;
