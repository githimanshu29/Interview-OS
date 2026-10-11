import { motion } from "motion/react";

export default function StatBox({
  label,
  value,
  sub,
  subHighlight,
  index = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-xl p-3 md:p-4

                 flex flex-col gap-1 shadow-[0_8px_32px_rgba(0,0,0,0.18)] hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition-all"
    >
      {/* glass sheen */}

      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />

      <p className="relative text-white/40 text-[9px] md:text-[11px] font-medium uppercase tracking-wider">
        {label}
      </p>

      <p className="relative text-white text-lg md:text-xl font-bold tracking-tight">
        {value}
      </p>

      {sub && (
        <div className="relative flex items-center gap-1 mt-0.5 flex-wrap">
          {subHighlight && (
            <span className="text-[9px] font-semibold bg-white/10 text-white/70 px-1 py-0.5 rounded">
              {subHighlight}
            </span>
          )}

          <span className="text-white/30 text-[9px] md:text-[11px]">{sub}</span>
        </div>
      )}
    </motion.div>
  );
}
