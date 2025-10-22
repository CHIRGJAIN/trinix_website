"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const INPUT_CLASSES =
  "rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 shadow-inner shadow-black/20 outline-none transition focus:border-aurora-teal focus:bg-cosmic-black/60 focus:text-white";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("success");
    setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mx-auto grid w-full max-w-3xl gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-left text-white/80 shadow-aurora backdrop-blur-2xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid gap-2">
        <label className="text-xs uppercase tracking-[0.35em] text-white/50" htmlFor="name">
          Name
        </label>
        <input id="name" type="text" placeholder="Your name" className={INPUT_CLASSES} required />
      </div>
      <div className="grid gap-2">
        <label className="text-xs uppercase tracking-[0.35em] text-white/50" htmlFor="email">
          Email
        </label>
        <input id="email" type="email" placeholder="you@trinix.ai" className={INPUT_CLASSES} required />
      </div>
      <div className="grid gap-2">
        <label className="text-xs uppercase tracking-[0.35em] text-white/50" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Let us know how we can collaborate."
          className={`${INPUT_CLASSES} resize-none`}
          required
        />
      </div>
      <motion.button
        type="submit"
        className="group inline-flex items-center justify-center gap-3 rounded-full border border-aurora-teal/60 bg-aurora-teal/20 px-10 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-aurora-teal/40"
        whileTap={{ scale: 0.97 }}
      >
        Submit
        <motion.span
          className="h-2 w-2 rounded-full bg-aurora-teal/80"
          animate={{ opacity: status === "success" ? [0.3, 1, 0.3] : 0.3 }}
          transition={{ repeat: status === "success" ? Infinity : 0, duration: 0.8 }}
        />
      </motion.button>
      {status === "success" && (
        <motion.p
          className="text-xs uppercase tracking-[0.3em] text-aurora-teal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Message queued for transmission.
        </motion.p>
      )}
    </motion.form>
  );
}
