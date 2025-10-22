"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ResearchHero() {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
      animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-3"
    >
      <h1 className="font-[var(--font-poppins)] text-3xl md:text-5xl font-semibold tracking-tight">
        Research Nexus
      </h1>
      <p className="text-base md:text-lg text-white/70 max-w-3xl">
        Peer‑reviewed work, pre‑print discoveries, and on‑going investigations advancing Trinix R&amp;D.
      </p>
    </motion.div>
  );
}

