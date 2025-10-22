"use client";

import { motion } from "framer-motion";
import { formatDate } from "@/lib/formatDate";

type Pre = {
  id: string;
  title: string;
  authors: string[];
  server: string;
  identifier: string;
  version_date: string;
  pdf?: string;
  domain?: string[];
};

export function PreprintList({ items, onOpen }: { items: Pre[]; onOpen?: (id: string) => void }) {
  if (!items.length) return <p className="text-white/60">No pre-prints found.</p>;
  return (
    <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
      {items.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.3, delay: i * 0.03 }}
          className="flex items-center justify-between gap-3 p-4 hover:bg-white/5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
          onClick={() => onOpen?.(p.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") onOpen?.(p.id);
          }}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-aurora-teal" aria-hidden />
            <div className="flex-1">
              <div className="font-medium text-white text-left line-clamp-2">{p.title}</div>
              <div className="mt-1 text-xs text-white/70">{p.authors.join(", ")}</div>
              <div className="mt-0.5 text-xs text-white/60">
                {p.server} • {formatDate(p.version_date, "short") || "Draft in review"}
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <button
              aria-label="Open preprint details"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:text-white hover:border-white/30"
              onClick={(e) => {
                e.stopPropagation();
                onOpen?.(p.id);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM13 3.5 18.5 9H13V3.5zM8 12h8v1.5H8V12zm0 3h8v1.5H8V15z" />
              </svg>
              PDF
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

