"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className="relative flex h-10 w-20 items-center rounded-full border border-white/10 bg-white/5 px-2 backdrop-blur transition hover:border-aurora-teal/80"
      aria-label="Toggle dark mode"
    >
      <motion.span
        layout
        className="absolute h-8 w-8 rounded-full bg-gradient-to-br from-aurora-teal/90 via-indigo-core/80 to-copper-gold/70 shadow-aurora"
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        animate={{ x: isDark ? 40 : 0 }}
      />
      <span className="relative flex flex-1 items-center justify-between text-xs font-medium uppercase tracking-widest text-[0.6rem]">
        <span className={isDark ? "text-white/40" : "text-white"}>Light</span>
        <span className={isDark ? "text-white" : "text-white/40"}>Dark</span>
      </span>
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute -top-3 right-2 text-[0.9rem] text-white/70"
      >
        {isDark ? "🌙" : "☀️"}
      </motion.div>
    </motion.button>
  );
}
