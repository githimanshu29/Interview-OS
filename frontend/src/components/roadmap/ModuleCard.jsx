import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiYoutube,
  FiBookOpen,
} from "react-icons/fi";

const difficultyColor = { Easy: "#34d399", Medium: "#a78bfa", Hard: "#f87171" };

const statusStyle = {
  Completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "In Progress": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Pending: "bg-white/5 text-white/35 border-white/10",
};

export default function ModuleCard({ mod, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileHover={{ y: -2 }}
      onClick={() => setOpen(!open)}
      className="relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-xl cursor-pointer select-none shadow-[0_4px_18px_rgba(0,0,0,0.2)] hover:border-white/20 transition-all"
    >
      {/* glass sheen */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent pointer-events-none" />

      <div className="relative flex items-center gap-3 p-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold bg-white/5 border border-white/10"
          style={{ color: difficultyColor[mod.difficulty] }}
        >
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{mod.title}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <FiClock size={10} className="text-white/30" />
            <span className="text-xs text-white/35">{mod.duration}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${statusStyle[mod.status]}`}
          >
            {mod.status}
          </span>
          <span
            className="text-xs font-medium hidden sm:block"
            style={{ color: difficultyColor[mod.difficulty] }}
          >
            {mod.difficulty}
          </span>
          {open ? (
            <FiChevronUp size={14} className="text-white/30" />
          ) : (
            <FiChevronDown size={14} className="text-white/30" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="relative px-4 pb-4 pt-0 border-t border-white/8">
              <p className="text-xs text-white/45 mt-3 mb-3 leading-relaxed">
                {mod.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                <a
                  href={mod.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-500/25 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                  >
                    <FiYoutube size={12} /> Watch Tutorial
                  </motion.button>
                </a>
                <a
                  href={mod.article}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/45 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <FiBookOpen size={12} /> Read Article
                  </motion.button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
