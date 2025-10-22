"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { CompanyOverview } from "./CompanyOverview";
import { MonolithsTimeline } from "./MonolithsTimeline";

export default function AboutPage() {
  const reduce = useReducedMotion();
  return (
    <div className="pb-20">
      {/* Hero */}
      <section role="banner" className="px-6 pt-24 pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="font-[var(--font-poppins)] text-3xl sm:text-5xl font-semibold"
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            About Trinix Private Limited
          </motion.h1>
          <motion.p
            className="text-white/80 mt-3"
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.05 }}
          >
            We build transformative solutions by fusing research, technology, and entrepreneurship.
          </motion.p>
        </div>
      </section>

      {/* Company overview */}
      <CompanyOverview />

      {/* Team message (moved before Journey) */}
      <section className="relative max-w-5xl mx-auto px-6 py-12">
        <h2 className="font-[var(--font-poppins)] text-2xl sm:text-3xl font-semibold mb-4">Message from Our Team</h2>
        <motion.div
          className="glass rounded-2xl border border-white/10 p-6"
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <p className="text-white/85 leading-7">
            At Trinix, we build technology that serves people. Our journey brings together research, engineering, and
            purposeful design to craft platforms that strengthen communities, accelerate businesses, and expand access
            to opportunity.
          </p>
          <p className="text-white/80 leading-7 mt-3">
            From SOS to our fintech research and growing subsidiaries, we remain focused on impact through
            innovation—delivering solutions that are dependable, scalable, and human-centered.
          </p>
          <p className="text-white/75 leading-7 mt-3">
            Thank you for being part of our story. We’re just getting started.
          </p>
        </motion.div>
      </section>

      {/* Journey over Dimension */}
      <MonolithsTimeline />

      {/* Values grid */}
      <section className="relative max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-[var(--font-poppins)] text-2xl sm:text-3xl font-semibold mb-6">Our Principles</h2>
        <div role="list" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "Integrity", desc: "We operate with honesty and accountability." },
            { label: "Innovation", desc: "We invest in research and bold ideas." },
            { label: "Collaboration", desc: "We empower teams and partners." },
            { label: "Growth", desc: "We scale sustainably, learning fast." },
            { label: "Impact", desc: "We build for real-world outcomes." },
          ].map((v, i) => (
            <div key={i} role="listitem" className="glass rounded-2xl p-4 border border-white/10">
              <div className="font-medium">{v.label}</div>
              <p className="text-white/70 text-sm mt-1">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      

      {/* CTA footer */}
      <section className="relative max-w-5xl mx-auto px-6 py-16 text-center">
        <h3 className="font-[var(--font-poppins)] text-2xl sm:text-3xl font-semibold">Let’s Build the Future Together</h3>
        <p className="text-white/80 mt-2">We collaborate with teams, researchers, and founders to turn ideas into reality.</p>
        <div className="mt-5">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium
            bg-gradient-to-r from-cyan-400/90 to-violet-400/90 text-black hover:from-cyan-300 hover:to-violet-300
            focus:outline-none focus-visible:ring-2 ring-offset-2 ring-offset-black ring-cyan-300/70"
          >
            Collaborate With Us
          </Link>
        </div>
      </section>
    </div>
  );
}
