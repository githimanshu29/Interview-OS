import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import {
  FiSend,
  FiFileText,
  FiClock,
  FiZap,
  FiX,
  FiCheck,
  FiChevronDown,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import RoadmapResult from "../components/roadmap/RoadmapResult";
import api from "../utils/axios";
import { useCoins } from "../apis/user.api";

const PACKAGE_OPTIONS = ["10 LPA", "15 LPA", "20 LPA", "30 LPA", "40 LPA"];

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onHistoryClick }) {
  const navigate = useNavigate();
  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-black/8 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-11 sm:h-12 max-w-7xl items-center justify-between px-3 sm:px-5">
        <div
          onClick={() => navigate("/dashboard")}
          className="flex cursor-pointer items-center gap-1.5"
        >
          <span className="text-sm sm:text-base font-extrabold text-[#0A0A0A]">
            Fresher.AI
          </span>
          <span className="hidden sm:block rounded bg-black/5 px-1.5 py-0.5 text-[10px] text-black/50">
            Roadmap Generator
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onHistoryClick}
          className="flex items-center gap-1 text-[10px] text-black/60 hover:text-[#0A0A0A] px-2.5 py-1.5 rounded-lg border border-black/15 hover:border-black/30 transition-all"
        >
          <FiClock size={11} />
          <span className="hidden sm:inline">History</span>
        </motion.button>
      </div>
    </nav>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Roadmap({ setUser }) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [role, setRole] = useState("");
  const [targetPackage, setTargetPackage] = useState(PACKAGE_OPTIONS[2]); // default "20 LPA"
  const [packageOpen, setPackageOpen] = useState(false);
  const [useResume, setUseResume] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const { resume } = useSelector((state) => state.resume);
  const navigate = useNavigate();

  useEffect(() => {
    getRoadmaps();
  }, []);

  const getRoadmaps = async () => {
    try {
      setHistoryLoading(true);

      const response = await api.get("/api/roadmap");
      setHistory(response.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const getRoadmapById = async (id) => {
    try {
      const { data } = await api.get(`/api/roadmap/${id}`);
      setRoadmap(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Generate a new roadmap ──
  async function handleGenerate() {
    if (!role.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const coinResponse = await useCoins({
        coins: 20,
        action: "resume-score",
      });
      setUser((prev) => ({
        ...prev,
        interviewCoin: coinResponse.interviewCoin,
      }));
      const { data } = await api.post("/api/roadmap/generate", {
        role: role.trim(),
        targetPackage,
        useResume,
        resume,
      });
      setRoadmap(data.data);
      // refresh history in the background so the new roadmap shows up
      getRoadmaps();
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
      setError(
        "Something went wrong while generating your roadmap. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] flex flex-col">
      <Navbar onHistoryClick={() => setHistoryOpen(!historyOpen)} />

      {/* Main */}
      <main className="flex-1 overflow-y-auto pb-28 sm:pb-32 pt-16 sm:pt-20">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 pt-5 sm:pt-6">
          <AnimatePresence mode="wait">
            {!roadmap ? (
              /* ── Empty State ── */
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center px-2 sm:px-4"
              >
                <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">🚀</div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0A0A0A] mb-2">
                  AI Roadmap Generator
                </h1>
                <p className="text-black/45 text-sm max-w-xs sm:max-w-md mb-1">
                  Generate a personalised roadmap for your dream job.
                </p>
                <p className="text-black/35 text-xs sm:text-sm max-w-xs sm:max-w-md">
                  Choose a role and let AI build a complete learning path.
                </p>

                {error && (
                  <p className="mt-4 text-xs text-red-500 max-w-xs sm:max-w-md">
                    {error}
                  </p>
                )}

                <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-xs sm:max-w-sm">
                  {["Frontend Dev", "Backend Eng", "ML Engineer"].map((r) => (
                    <motion.button
                      key={r}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setRole(r)}
                      className="relative overflow-hidden text-xs py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-[#000000]/90 backdrop-blur-2xl border border-white/10 text-white/55 hover:text-white hover:border-white/25 shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent pointer-events-none" />
                      <span className="relative">{r}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <RoadmapResult
                key="roadmap"
                roadmap={roadmap}
                onClear={() => setRoadmap(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── History Drawer ── */}
      <AnimatePresence>
        {historyOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHistoryOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />
            <motion.aside
              key="drawer"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[280px] sm:w-[300px] max-w-[85vw] bg-white border-l border-black/8 flex flex-col overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.1)]"
            >
              <div className="flex items-center justify-between px-4 py-3 sm:py-4 border-b border-black/8 sticky top-0 bg-white/90 backdrop-blur-xl">
                <span className="text-sm font-semibold text-[#0A0A0A]">
                  Previous Roadmaps
                </span>
                <button
                  onClick={() => setHistoryOpen(false)}
                  className="text-black/35 hover:text-[#0A0A0A] transition-colors"
                >
                  <FiX size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-2 p-3">
                {historyLoading ? (
                  <p className="text-xs text-black/35 text-center py-6">
                    Loading…
                  </p>
                ) : history.length === 0 ? (
                  <p className="text-xs text-black/35 text-center py-6">
                    No roadmaps yet.
                  </p>
                ) : (
                  history.map((item) => (
                    <motion.button
                      key={item._id}
                      onClick={() => {
                        getRoadmapById(item._id);
                        setHistoryOpen(false);
                      }}
                      className="relative overflow-hidden text-left p-4 rounded-xl bg-[#000]/90 border border-white/10"
                    >
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      <div className="flex justify-between items-center my-1">
                        <span className="text-violet-400 text-xs">
                          {item.targetPackage}
                        </span>
                        <p className="text-xs text-white/40">{item.duration}</p>
                      </div>

                      <p className="text-xs text-white/30 mt-1">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Fixed Bottom Input ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pb-3 sm:pb-4 pt-3 px-3 sm:px-4 bg-gradient-to-t from-white via-white/95 to-transparent">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-visible flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-[#000000]/90 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
          >
            {/* Role Input */}
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Backend Developer"
              className="relative flex-1 min-w-0 bg-transparent text-xs sm:text-sm text-white placeholder-white/30 outline-none px-2 py-1.5"
            />

            {/* Target Package Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPackageOpen(!packageOpen)}
                type="button"
                className="relative flex items-center gap-1 text-xs px-2.5 py-2 rounded-xl border border-white/10 text-white/60 hover:text-white/90 hover:border-white/20 transition-all whitespace-nowrap bg-white/5"
              >
                {targetPackage}
                <FiChevronDown
                  size={11}
                  className={`transition-transform ${packageOpen ? "rotate-180" : ""}`}
                />
              </motion.button>

              <AnimatePresence>
                {packageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full mb-2 right-0 w-28 rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-[0_8px_24px_rgba(0,0,0,0.35)] z-10"
                  >
                    {PACKAGE_OPTIONS.map((pkg) => (
                      <button
                        key={pkg}
                        onClick={() => {
                          setTargetPackage(pkg);
                          setPackageOpen(false);
                        }}
                        className={`w-full text-left text-xs px-3 py-2 transition-colors ${
                          pkg === targetPackage
                            ? "bg-white/10 text-white"
                            : "text-white/55 hover:bg-white/5 hover:text-white/90"
                        }`}
                      >
                        {pkg}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Use Resume Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setUseResume(!useResume)}
              type="button"
              className={`flex items-center text-xs gap-1 px-2 py-2 rounded-xl ${
                useResume
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-white/5 text-white/60"
              }`}
            >
              {useResume ? (
                <>
                  <FiCheck size={12} />
                  Added
                </>
              ) : (
                <>
                  <FiFileText size={12} />
                  Resume
                </>
              )}
            </motion.button>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleGenerate}
              disabled={loading || !role.trim()}
              className="relative flex items-center gap-1.5 text-xs px-3 sm:px-4 py-2 rounded-xl font-semibold text-[#0A0A0A] bg-white hover:bg-white/90 shadow-[0_2px_10px_rgba(255,255,255,0.12)] transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="inline-block"
                  >
                    <FiZap size={12} />
                  </motion.span>
                  <span className="hidden sm:inline">Generating…</span>
                </>
              ) : (
                <>
                  <FiSend size={12} />
                  <span className="hidden sm:inline">Generate</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
