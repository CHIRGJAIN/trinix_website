"use client";

import { motion } from "framer-motion";

const HIGHLIGHTS = [
  "Quantum-native orchestration",
  "Vedic-aligned AI co-pilots",
  "Autonomous Kubernetes fabrics",
];
export function HeroSection() {
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col gap-12 overflow-hidden px-6 py-28 text-center md:text-left">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 space-y-8"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs uppercase tracking-[0.45em] text-white/60">
            Futuristic • Vedic AI • Quantum Computing • Kubernetes
          </p>
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.35em] text-aurora-teal/80 md:justify-end">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-aurora-teal/60" />
            <span>Trinix OS • Alpha Fabric</span>
          </div>
        </div>

        <div className="space-y-6 text-balance">
          <motion.h1
            className="font-display text-5xl font-semibold leading-tight text-white md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Merging Vedic Wisdom with Quantum-Accelerated Intelligence
          </motion.h1>
          <motion.p
            className="mx-auto max-w-3xl text-lg text-white/70 md:ml-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            Trinix assembles polymath research pods to build an ever-evolving operating system for future-native
            enterprises. This hero section is primed for richer motion graphics, morphing sigils, and neural grids.
          </motion.p>
        </div>

        <motion.div
          className="flex flex-col gap-4 md:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
        >
          <a
            href="#projects"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-aurora-teal/50 px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-core/80 via-aurora-teal/80 to-copper-gold/80 opacity-0 transition group-hover:opacity-100" />
            <span className="relative">Explore Initiatives</span>
          </a>
          <a
            href="#vision"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white/70 transition hover:text-white"
          >
            Watch the Vision Reel
          </a>
        </motion.div>

        <motion.ul
          className="grid gap-4 border-t border-white/10 pt-6 text-left text-sm text-white/60 md:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {HIGHLIGHTS.map((highlight) => (
            <li
              key={highlight}
              className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-5 py-4 shadow-circuit"
            >
              <span className="h-2 w-2 rounded-full bg-aurora-teal shadow-aurora" />
              <span>{highlight}</span>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-10rem] z-0 mx-auto h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-indigo-core/40 via-aurora-teal/30 to-transparent blur-3xl"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 2.4, ease: "easeOut" }}
      />
    </section>
  );
}

