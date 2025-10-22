"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import jobs from "@/data/jobs.json";
import { JobCard } from "@/components/JobCard";
import type { JobRole } from "@/types/content";

const LIFE_AT_TRINIX = [
  "Quantum-ready labs with immersive holo-sim collaboration pods.",
  "Vedic meditation domes synchronised with AI wellbeing co-pilots.",
  "Fully autonomous Kubernetes playgrounds for rapid prototyping.",
];

export default function CareersPage() {
  const jobRoles = jobs as JobRole[];
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-20 text-white">
      <motion.section
        className="space-y-6"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-aurora-teal/70">Join The Pods</p>
          <h1 className="font-display text-4xl font-semibold">Careers</h1>
          <p className="max-w-3xl text-base text-white/70">
            We are assembling cross-disciplinary crews for quantum-ready, AI-aligned problem spaces. The roles below are
            placeholders to signal the range of talent Trinix collaborates with.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-white/70 backdrop-blur-2xl">
          <p className="font-display text-lg text-white">Life at Trinix (Placeholder)</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {LIFE_AT_TRINIX.map((item) => (
              <motion.div
                key={item}
                className="rounded-2xl border border-white/10 bg-cosmic-black/50 p-4 leading-relaxed shadow-aurora"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="space-y-8"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <h2 className="font-display text-3xl font-semibold">Open Roles</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {jobRoles.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              location={job.location}
              type={job.type}
              description={job.description}
              link={job.link}
              onApply={() => setSelectedRole(job)}
            />
          ))}
        </div>
      </motion.section>

      <AnimatePresence>
        {selectedRole && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/10 p-8 text-white backdrop-blur-2xl"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-aurora-teal/70">Apply Placeholder</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold">{selectedRole.title}</h3>
                  <p className="mt-2 text-sm text-white/70">
                    {selectedRole.location} • {selectedRole.type}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white"
                >
                  Close
                </button>
              </div>

              <p className="mt-6 text-sm text-white/70">
                This modal reserves space for the full apply flow with validation, upload widgets, and confirmation states.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

