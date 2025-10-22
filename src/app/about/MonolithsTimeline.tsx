"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAbout } from "@/state/about";
import { motion, useReducedMotion } from "framer-motion";

export function MonolithsTimeline() {
  const { milestones, setActiveIndex, setJourneyInView } = useAbout();
  const containerRef = useRef<HTMLDivElement | null>(null);
  // no motion needed here; just state driven

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const h = el.clientHeight || 1;
      const idx = Math.round(el.scrollTop / h);
      setActiveIndex(Math.max(0, Math.min(milestones.length - 1, idx)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [milestones.length, setActiveIndex]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        const v = entries.some((e) => e.isIntersecting);
        setJourneyInView(v);
      },
      { root: null, threshold: 0.15 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, [setJourneyInView]);

  const pages = useMemo(() => new Array(milestones.length).fill(0), [milestones.length]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const h = el.clientHeight || 1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const idx = Math.min(milestones.length - 1, Math.round(el.scrollTop / h) + 1);
      el.scrollTo({ top: idx * h, behavior: "smooth" });
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const idx = Math.max(0, Math.round(el.scrollTop / h) - 1);
      el.scrollTo({ top: idx * h, behavior: "smooth" });
    }
  };

  return (
    <section className="relative max-w-6xl mx-auto px-6 py-16" aria-labelledby="journey-heading">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 id="journey-heading" className="font-[var(--font-poppins)] text-2xl sm:text-3xl font-semibold">
            Our Journey
          </h2>
          <p className="text-white/70">Key milestones that shaped Trinix.</p>
        </div>
        <div className="hidden sm:block text-xs text-white/50">Scroll to explore</div>
      </div>

      {/* Desktop: vertical snap scroller controlling which plaque is highlighted */}
      <div
        ref={containerRef}
        className="hidden md:block relative h-[70vh] overflow-y-auto snap-y snap-mandatory rounded-xl border border-white/10"
        role="list"
        aria-label="Milestones"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {pages.map((_, i) => (
          <div
            key={i}
            className="h-[70vh] snap-start flex items-center justify-center p-4"
            role="listitem"
            aria-label={`Milestone ${i + 1}`}
          >
            <TimelineCard index={i} />
          </div>
        ))}
      </div>

      {/* Mobile: swipeable carousel */}
      <MobileTimeline />
    </section>
  );
}

function TimelineCard({ index }: { index: number }) {
  const { milestones, setActiveIndex } = useAbout();
  const reduce = useReducedMotion();
  const m = milestones[index];
  return (
    <motion.article
      className="glass rounded-2xl border border-white/10 w-full max-w-xl p-6"
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.6 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onViewportEnter={() => setActiveIndex(index)}
    >
      <div className="text-[11px] uppercase tracking-widest text-cyan-300/90">{m.date}</div>
      <h3 className="mt-1 font-[var(--font-poppins)] text-xl">{m.title}</h3>
      <p className="mt-2 text-white/80 leading-7 text-[15px]">{m.description}</p>
    </motion.article>
  );
}

function MobileTimeline() {
  const { milestones, activeIndex, setActiveIndex } = useAbout();
  const reduce = useReducedMotion();

  return (
    <div className="md:hidden mt-6" role="region" aria-label="Milestones carousel">
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2" role="list">
        {milestones.map((m, i) => (
          <motion.article
            key={i}
            role="listitem"
            tabIndex={0}
            className="min-w-[85%] glass rounded-2xl p-4 snap-center border border-white/10"
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onFocus={() => setActiveIndex(i)}
          >
            <div className="text-[11px] uppercase tracking-widest text-cyan-300/90">{m.date}</div>
            <div className="mt-1 font-[var(--font-poppins)] text-base">{m.title}</div>
            <p className="mt-1 text-sm text-white/80">{m.description}</p>
          </motion.article>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-3" aria-hidden>
        {milestones.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={
              "h-1.5 rounded-full transition-all " +
              (activeIndex === i ? "w-6 bg-cyan-300" : "w-2 bg-white/30")
            }
            aria-label={`Go to milestone ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
