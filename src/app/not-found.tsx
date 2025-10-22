"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden bg-cosmic-black text-white">
      <FractalBackdrop />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center gap-6 px-6 text-center"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-aurora-teal/70">404 Signal Lost</p>
        <h1 className="font-display text-4xl font-semibold">Fractal drift detected</h1>
        <p className="max-w-xl text-sm text-white/65">
          The requested node dissolved into the quantum mandala. Navigate back to recalibrate your journey.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-3 rounded-full border border-aurora-teal/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white hover:text-white"
        >
          Return Home
          <span aria-hidden>→</span>
        </Link>
      </motion.div>
    </div>
  );
}

function FractalBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle,rgba(61,245,242,0.25),transparent_60%)]"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(63,60,216,0.15),transparent)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\'%3E%3Cpath d=\'M100 10 L130 100 L100 190 L70 100 Z\' fill=\'none\' stroke=\'rgba(240,179,90,0.35)\' stroke-width=\'1\'/%3E%3C/svg%3E')] opacity-30"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

