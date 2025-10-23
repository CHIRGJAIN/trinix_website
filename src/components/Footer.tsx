"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mt-16 border-t border-white/5 bg-gradient-to-r from-white/5 via-indigo-core/10 to-white/5 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-white/70">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">Trinix Pvt. Ltd.</p>
            <p className="font-display text-lg text-white">Merging Vedic Wisdom with AI frontiers.</p>
          </div>
          <p className="max-w-md text-sm text-white/60">
            Building resilient, human-aligned intelligence systems rooted in timeless principles and engineered for quantum-ready futures.
          </p>
        </div>
        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-white/60">
            <p>© {currentYear} Trinix Pvt. Ltd. All rights reserved.</p>
            <p className="mt-1">Crafted on Kubernetes-native, quantum-forward principles.</p>
          </div>
          <Link
            href="/admin/login"
            className="group relative inline-flex items-center justify-center self-start rounded-full border border-aurora-teal/60 px-5 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.35em] text-white transition-all duration-300 hover:border-aurora-teal hover:bg-aurora-teal/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60 md:self-auto"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-core/20 via-aurora-teal/30 to-copper-gold/20 opacity-0 transition group-hover:opacity-100" />
            <span className="relative">Login</span>
          </Link>
        </div>
      </div>
    </motion.footer>
  );
}
