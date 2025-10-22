"use client";

import { motion, useScroll } from "framer-motion";
import { useMemo, useRef } from "react";

const PLACEHOLDER_CONTENT = new Array(6).fill(
  "This section will host long-form narrative weaving Vedic insights with quantum-native engineering chronicles."
);

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  const formattedTitle = useMemo(() => {
    return params.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [params.slug]);

  return (
    <div className="relative" ref={containerRef}>
      <motion.div className="fixed inset-x-0 top-[64px] z-40 h-1 bg-white/10">
        <motion.span
          className="block h-full origin-left bg-gradient-to-r from-aurora-teal via-indigo-core to-copper-gold"
          style={{ scaleX: scrollYProgress }}
        />
      </motion.div>

      <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-32 text-white">
        <motion.section
          className="space-y-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-aurora-teal/70">Signal Thread</p>
          <h1 className="font-display text-4xl font-semibold">{formattedTitle}</h1>
          <p className="text-sm text-white/60">
            Placeholder meta: author tag, publication date, and estimated read duration will appear here.
          </p>
        </motion.section>

        <motion.section
          className="space-y-8 text-lg leading-relaxed text-white/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          {PLACEHOLDER_CONTENT.map((paragraph, index) => (
            <p key={index}>
              {paragraph} Paragraph {index + 1} remains open for high-fidelity storytelling, diagrams, and embedded
              simulations.
            </p>
          ))}
        </motion.section>

        <motion.section
          className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p className="font-display text-lg text-white">AI Summary Placeholder</p>
          <p className="mt-2">
            Reserve this space for animated AI-assisted recaps, voiceovers, or interactive question-answer overlays.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
