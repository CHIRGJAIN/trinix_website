"use client";

import { motion, useReducedMotion } from "framer-motion";

export function CompanyOverview() {
  const reduce = useReducedMotion();
  return (
    <section
      role="region"
      aria-label="Company overview"
      className="relative max-w-6xl mx-auto px-6 py-12"
    >
      <div className="grid md:grid-cols-1 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="space-y-5"
        >
          <h2 className="font-[var(--font-poppins)] text-2xl sm:text-3xl font-semibold">
            Company Overview
          </h2>
          <p className="text-white/80 leading-7">
            Trinix Private Limited is a dynamic, innovation-driven company dedicated to building transformative
            solutions and fostering a culture of progress. We work on a wide range of in-house projects and lead a
            growing network of subsidiaries that span industries such as web services, technology development,
            digital platforms, and research-driven innovation. Our multidisciplinary approach allows us to combine
            creativity, cutting-edge technology, and rigorous research to deliver impactful solutions that address
            real-world challenges.
          </p>
          <p className="text-white/80 leading-7">
            We believe innovation flourishes when people are empowered. We actively encourage our employees and
            teams to transform their ideas into ventures by providing them with logistical support, research
            infrastructure, and operational guidance under the Trinix umbrella. This collaborative ecosystem not
            only nurtures new startups but also fuels our mission to be a launchpad for pioneering technologies,
            scientific exploration, and sustainable business growth. Together, we aim to shape a future where
            research, creativity, and entrepreneurship drive meaningful change across industries and communities.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
