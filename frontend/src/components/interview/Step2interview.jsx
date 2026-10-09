import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiArrowRight,
  FiClock,
  FiMessageSquare,
  FiMic,
  FiMicOff,
  FiCamera,
  FiCameraOff,
  FiCode,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Timer from "./Timer";
import maleVideo from "../../assets/male-ai.mp4";
import femaleVideo from "../../assets/female-ai.mp4";
import CodeEditorPanel from "./CodeEditorPanel";
import { submitAnswer } from "../../apis/interview.api";

function Step2interview({ interviewData, user }) {
  const navigate = useNavigate();

  // ── State ──
  const [question, setQuestion] = useState(interviewData.question);
  const [currentIndex, setCurrentIndex] = useState(
    interviewData.currentQuestion || 0,
  );
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(interviewData.question.timer || 60);
  const [timerActive, setTimerActive] = useState(true); // paused once the answer is submitted

  // UI toggles
  const [micOn, setMicOn] = useState(true); // user's manual preference — only changed by the mic button
  const [cameraOn, setCameraOn] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

  // Speech
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");
  const [introSpoken, setIntroSpoken] = useState(false);

  // Refs
  const aiVideoRef = useRef(null);
  const userVideoRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;
  const userName = user?.name || "there";
  const userInitial = userName.charAt(0).toUpperCase();
  const progress = ((currentIndex + 1) / interviewData.totalQuestions) * 100;

  // Mic is only ever turned on/off by the button (micOn). While the AI is
  // speaking we still pause the underlying recognition engine so it doesn't
  // pick up the AI's own voice, but that's just visual/technical — the
  // button's actual on/off state never changes on its own.
  const micVisualOn = micOn && !isAIPlaying;

  // ── Load voices ──
  useEffect(() => {
    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const female = voices.find((v) => /zira|samantha|female/i.test(v.name));
      const male = voices.find((v) => /david|mark|male/i.test(v.name));
      if (female) {
        setSelectedVoice(female);
        setVoiceGender("female");
      } else if (male) {
        setSelectedVoice(male);
        setVoiceGender("male");
      } else {
        setSelectedVoice(voices[0]);
        setVoiceGender("female");
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  // ── Speech recognition ──
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const rec = new window.webkitSpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const t = e.results[e.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + t);
    };
    recognitionRef.current = rec;
  }, []);

  const startMic = () => {
    try {
      recognitionRef.current?.start();
    } catch {}
  };
  const stopMic = () => {
    recognitionRef.current?.stop();
  };

  // Only place that changes the user's mic preference — the button.
  const toggleMic = () => {
    if (micOn) {
      stopMic();
    } else {
      startMic();
    }
    setMicOn(!micOn);
  };

  // ── Camera ──
  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        setCameraOn(true);
        setTimeout(() => {
          if (userVideoRef.current) userVideoRef.current.srcObject = stream;
        }, 100);
      } catch {
        setCameraOn(false);
      }
    }
  };

  // ── Speak ──
  const speakText = (text) =>
    new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice || !text?.trim()) {
        resolve();
        return;
      }

      // Cancel anything currently speaking first.
      window.speechSynthesis.cancel();

      // Chrome has a known race condition where calling speak() right after
      // cancel() causes the new utterance's onend to fire instantly without
      // actually speaking. A tiny delay avoids that.
      setTimeout(() => {
        const utter = new SpeechSynthesisUtterance(
          text.replace(/,/g, ", ... ").replace(/\./g, ". ... "),
        );
        utter.voice = selectedVoice;
        utter.rate = 0.92;
        utter.pitch = 1.05;
        utter.volume = 1;
        utter.onstart = () => {
          setIsAIPlaying(true);
          // Pause recognition only while AI is actually speaking, so it
          // doesn't capture the AI's own voice. This doesn't change micOn.
          stopMic();
          aiVideoRef.current?.play();
        };
        utter.onend = () => {
          aiVideoRef.current?.pause();
          if (aiVideoRef.current) aiVideoRef.current.currentTime = 0;
          setIsAIPlaying(false);
          // Resume listening only if the user's mic preference is still on.
          if (micOn) startMic();
          setTimeout(() => {
            setSubtitle("");
            resolve();
          }, 300);
        };
        setSubtitle(text);
        window.speechSynthesis.speak(utter);
      }, 150);
    });

  // ── Welcome + First Question on voice load ──
  useEffect(() => {
    if (!selectedVoice || introSpoken) return;
    const runIntro = async () => {
      setIntroSpoken(true);
      // Small pause after everything loads before the AI starts talking.
      await new Promise((r) => setTimeout(r, 1200));
      await speakText(
        `Welcome ${userName.split(" ")[0]}! Let's begin your interview.`,
      );
      await new Promise((r) => setTimeout(r, 900));
      await speakText(interviewData.question.question);
    };
    runIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVoice]);

  // ── Speak question when it changes (not first load) ──
  useEffect(() => {
    if (!introSpoken || !selectedVoice) return;
    const speak = async () => {
      await new Promise((r) => setTimeout(r, 900));
      await speakText(question.question);
    };
    speak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  // ── Sync interviewData ──
  useEffect(() => {
    setQuestion(interviewData.question);
    setCurrentIndex(interviewData.currentQuestion);
    setTimeLeft(interviewData.question.timer || 60);
  }, [interviewData]);

  // ── Timer reset on question change ──
  useEffect(() => {
    setTimeLeft(question.timer || 60);
    setTimerActive(true);
  }, [question]);

  // ── Timer countdown ──
  useEffect(() => {
    if (timeLeft <= 0 || !timerActive) return;
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, timerActive]);

  // ── Auto-submit when timer hits 0 ──
  useEffect(() => {
    if (timeLeft !== 0) return;
    const autoSubmit = async () => {
      await speakText("Time is up. Submitting your answer now.");
      const finalAnswer = answer.trim() || "No answer provided. Time over.";

      setLoading(true);
      const res = await submitAnswer({
        interviewId: interviewData.interviewId,
        answer: finalAnswer,
      });

      if (res.completed) {
        setFeedback(res.feedback);
        await new Promise((r) => setTimeout(r, 700));
        await speakText(
          res.feedback?.feedback ||
            "Great job! Your interview is complete. Preparing your report now.",
        );
        setLoading(false);
        navigate(`/interview/${interviewData.interviewId}/report`);
        return;
      }

      setFeedback(res.feedback);
      await new Promise((r) => setTimeout(r, 700));
      await speakText(
        res.feedback?.feedback ||
          "Noted your answer. Let's move to the next question.",
      );

      setLoading(false);
      setQuestion(res.question);
      setCurrentIndex(res.currentQuestion);
      setAnswer("");
      setFeedback(null);
    };
    autoSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // ── Submit ──
  const submit = async () => {
    if (!answer.trim()) return;

    setTimerActive(false); // stop the countdown as soon as the answer is submitted
    setLoading(true);
    const res = await submitAnswer({
      interviewId: interviewData.interviewId,
      answer,
    });

    if (res.completed) {
      setFeedback(res.feedback);
      await new Promise((r) => setTimeout(r, 700));
      await speakText(
        res.feedback?.feedback ||
          "Great job! Your interview is complete. Preparing your report now.",
      );
      setLoading(false);
      navigate(`/interview/${interviewData.interviewId}/report`);
      return;
    }

    setFeedback(res.feedback);
    await new Promise((r) => setTimeout(r, 700));
    await speakText(
      res.feedback?.feedback ||
        "Noted your answer. Let's move to the next question.",
    );
    setLoading(false);
    setQuestion(res.question);
    setCurrentIndex(res.currentQuestion);
    setAnswer("");
    setFeedback(null);
  };

  // ── Code editor → append to answer ──
  const handleCodeSubmit = (code) => {
    setAnswer((prev) => {
      const separator = prev.trim() ? "\n\n--- Code ---\n" : "--- Code ---\n";
      return prev + separator + code;
    });
    setCodeOpen(false);
  };

  // ── Cleanup ──
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-5">
      {/* Code Editor Popup */}
      <CodeEditorPanel
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        onSubmitCode={handleCodeSubmit}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl bg-[#0E1016] border border-white/10 rounded-2xl sm:rounded-[24px] overflow-hidden shadow-[0_0_60px_rgba(255,255,255,.03)] grid lg:grid-cols-[36%_64%]"
      >
        {/* ── LEFT: AI Video + User Camera + Controls ── */}
        <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-white/8 p-4 sm:p-5 gap-3">
          {/* AI Video */}
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
            <video
              ref={aiVideoRef}
              src={videoSource}
              muted
              playsInline
              preload="auto"
              loop
              className="w-full h-full object-cover"
            />
            {isAIPlaying && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                <div className="flex gap-0.5 items-end h-3">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-white rounded-full"
                      animate={{ height: ["4px", "12px", "4px"] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-white/80">AI Speaking</span>
              </div>
            )}
          </div>

          {/* Reserved Subtitle Space */}
          <div className="min-h-[52px] flex items-center">
            <AnimatePresence>
              {subtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full rounded-xl bg-white/5 border border-white/8 px-3 py-2"
                >
                  <p className="text-xs text-white/65 leading-relaxed text-center">
                    {subtitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Camera / Initial Box */}
          <div className="relative rounded-xl overflow-hidden bg-[#17181E] border border-white/8 aspect-video flex items-center justify-center">
            {cameraOn ? (
              <>
                <video
                  ref={userVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
                  <span className="text-[10px] text-white/70">You</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {userInitial}
                  </span>
                </div>
                <span className="text-xs text-white/35">
                  {userName.split(" ")[0]}
                </span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-1.5 pt-1">
            <div className="flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={toggleMic}
                title={micOn ? "Mute mic" : "Unmute mic"}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  micVisualOn
                    ? "bg-white/10 border-white/15 text-white"
                    : "bg-red-500/20 border-red-500/30 text-red-400"
                }`}
              >
                {micVisualOn ? <FiMic size={15} /> : <FiMicOff size={15} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={toggleCamera}
                title={cameraOn ? "Turn off camera" : "Turn on camera"}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  cameraOn
                    ? "bg-white/10 border-white/15 text-white"
                    : "bg-white/5 border-white/10 text-white/45 hover:text-white/70"
                }`}
              >
                {cameraOn ? <FiCamera size={15} /> : <FiCameraOff size={15} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setCodeOpen(true)}
                title="Open code editor"
                className="w-10 h-10 rounded-xl flex items-center justify-center border bg-white/5 border-white/10 text-white/45 hover:text-white/70 hover:border-white/20 transition-all"
              >
                <FiCode size={15} />
              </motion.button>
            </div>

            {/* Indicator: mic on but paused because AI is speaking — reserved space so layout doesn't jump */}
            <div className="min-h-[14px] flex items-center justify-center">
              {micOn && isAIPlaying && (
                <span className="text-[10px] text-red-400/80">
                  Mic paused — AI is speaking
                </span>
              )}
            </div>

            {/* Hint: code editor usage */}
            <span className="text-[10px] text-white/35 text-center">
              Coding question? Use{" "}
              <FiCode size={9} className="inline -mt-0.5" /> to write &amp; add
              code
            </span>
          </div>
        </div>

        {/* ── RIGHT: Question + Answer ── */}
        <div className="flex flex-col p-4 sm:p-6">
          {/* Header with timer on top right */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white">
                AI Interview
              </h2>
              <div className="flex items-center gap-2 text-zinc-500 text-xs mt-0.5">
                <FiClock size={11} />
                <span>{question?.difficulty}</span>
              </div>
            </div>

            {/* Timer — top right */}
            <div className="flex flex-col items-end gap-1.5 min-w-[110px]">
              <Timer timeLeft={timeLeft} totalTime={question?.timer || 60} />
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={question?.question}
            className="relative overflow-hidden rounded-xl bg-[#17181E] border border-white/8 p-4 sm:p-5 mb-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
            <div className="relative flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center shrink-0">
                <FiMessageSquare size={14} />
              </div>
              <p className="text-xs text-zinc-500">
                Question {currentIndex + 1}
              </p>
            </div>
            <p className="relative text-white text-sm sm:text-base leading-7">
              {question.question}
            </p>
          </motion.div>

          {/* Progress — above answer input box */}
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-white/35 mb-1">
              <span>Progress</span>
              <span>
                {currentIndex + 1}/{interviewData.totalQuestions}
              </span>
            </div>
            <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Answer */}
          <div className="flex-1 flex flex-col min-h-0">
            <label className="text-xs font-medium text-zinc-400 mb-1.5">
              Your Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === "Enter") submitAnswer();
              }}
              rows={5}
              placeholder="Write your answer here… or speak if mic is on"
              className="flex-1 w-full rounded-xl bg-[#17181E] border border-white/8 p-4 text-sm text-white outline-none resize-none focus:border-white/25 transition placeholder-white/20"
            />
          </div>

          {/* Feedback — reserved space so the bottom bar doesn't jump */}
          <div className="mt-3 min-h-[0px]">
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 max-h-40 overflow-y-auto"
                >
                  <p className="text-xs uppercase tracking-widest text-green-400 mb-2">
                    AI Feedback
                  </p>
                  <p className="text-sm text-zinc-300 leading-6">
                    {feedback.feedback}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/8">
            <span className="text-xs text-zinc-600 hidden sm:block">
              Press{" "}
              <kbd className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-white text-[10px]">
                Ctrl+Enter
              </kbd>
              to submit
            </span>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || !answer.trim()}
              onClick={submit}
              className="ml-auto h-10 min-w-[150px] justify-center px-5 rounded-xl bg-white text-black text-sm font-semibold flex items-center gap-2 disabled:opacity-40 transition"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit Answer <FiArrowRight size={15} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Step2interview;
