"use client";

import { motion } from "framer-motion";

type Og = {
  id: string;
  title: string;
  lead_researcher: string;
  domain?: string[];
  milestone_next: string;
  eta_quarter: string;
  brief?: string;
  spec?: string;
};

export function OngoingTimeline({ items, onOpen }: { items: Og[]; onOpen?: (id: string) => void }) {
  if (!items.length) return <p className="text-white/60">No on-going items currently displayed.</p>;
  return (
    <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
      {items.map((it, i) => (
        <motion.div
          key={it.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35, delay: i * 0.04 }}
          className="flex items-center justify-between gap-3 p-4 hover:bg-white/5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
          onClick={() => onOpen?.(it.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onOpen?.(it.id); }}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-aurora-teal" aria-hidden />
            <div className="flex-1">
              <div className="font-medium text-white text-left line-clamp-2">{it.title}</div>
              <div className="mt-1 text-xs text-white/70">Lead: {it.lead_researcher}</div>
              <div className="mt-0.5 text-xs text-white/60">
                Next: {it.milestone_next} • ETA: {it.eta_quarter}
              </div>
              {it.domain && it.domain.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {it.domain.map((d) => (
                    <span key={d} className="inline-block rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70">{d}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="shrink-0">
            <button
              aria-label="View ongoing project details"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:text-white hover:border-white/30"
              onClick={(e) => {
                e.stopPropagation();
                onOpen?.(it.id);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              View
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

