import React from "react";
import { motion } from "motion/react";
import { GiArtificialHive } from "react-icons/gi";
import { LoginModel } from "../components/LoginModel";
import { useState } from "react";

function Home({ user, setUser }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <div className="bg-white text-[#0A0A0A] font-sans min-h-screen overflow-x-hidden">
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 h-[52px] flex items-center justify-between px-5 bg-white/70 backdrop-blur-xl border-b border-black/5"
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0A0A0A] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.18)]">
            <GiArtificialHive size={15} color="white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-[#0A0A0A]">
            Interview-OS
          </span>
        </div>

        {/* Nav Button */}
        <motion.button
          onClick={() => setShowLoginModal(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="bg-[#0A0A0A]/80 backdrop-blur-2xl text-white font-semibold border border-white/10 rounded-md px-3 py-1.5 text-xs cursor-pointer transition-all hover:border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
        >
          Log In →
        </motion.button>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="relative pt-20 pb-14 overflow-hidden bg-[#F8F9FA]">
        {/* Subtle dark glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-black/[0.04] blur-[90px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="inline-flex items-center px-3 py-1.5 rounded-full border border-black/15 bg-black/5 text-black/70 text-xs font-medium mb-4"
          >
            Multi-Agent Interview Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="text-3xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-4 text-[#0A0A0A] [text-shadow:0_4px_24px_rgba(0,0,0,0.12)]"
          >
            Job Interviews
            <br />
            <span className="text-black/30">Don't Have to Suck</span>
            <br />
            Anymore!
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-black/45 text-sm leading-relaxed max-w-md mx-auto mb-6 [text-shadow:0_2px_10px_rgba(0,0,0,0.06)]"
          >
            Interview-OS is an innovative AI-powered interview preparation
            platform designed to help job seekers excel in their interviews.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
          >
            <motion.button
              onClick={() => setShowLoginModal(true)}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 36px rgba(0,0,0,0.18)",
              }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden bg-[#0A0A0A]/80 backdrop-blur-2xl text-white font-bold px-5 py-2.5 rounded-lg text-xs cursor-pointer border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all hover:border-white/20"
            >
              Get started for free →
              <span className="absolute inset-0 bg-gradient-to-br from-white/[0.1] via-transparent to-transparent pointer-events-none rounded-lg" />
            </motion.button>
          </motion.div>

          {/* Hero Image */}
          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 rounded-lg overflow-hidden  shadow-[0_0_60px_rgba(0,0,0,0.06)] max-w-2xl mx-auto"
          >
            <img
              src={img}
              alt="IOS.Ai Dashboard"
              className="w-full h-auto object-cover block "
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/900x500/F3F4F6/0A0A0A?text=IOS.Ai+Dashboard";
              }}
            />
          </motion.div> */}
        </div>
      </section>

      {/* Login Modal placeholder */}
      {showLoginModal && (
        <LoginModel
          onClose={() => setShowLoginModal(false)}
          setUser={setUser}
        />
      )}
    </div>
  );
}

export default Home;
