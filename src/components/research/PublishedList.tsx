"use client";

import { motion } from "framer-motion";

type Pub = {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  doi?: string;
  pdf?: string;
  code?: string;
  open_access?: boolean;
  award?: string;
  domain?: string[];
};

export function PublishedList({ items }: { items: Pub[] }) {
  if (!items.length) return <p className="text-white/60">No published papers yet.</p>;
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((p, i) => (
        <motion.article
          key={p.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35, delay: i * 0.04 }}
          className="relative rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg/30 hover:shadow-xl transition-shadow group"
          aria-labelledby={`pub-${p.id}`}
        >
          <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-2xl bg-gradient-to-b from-aurora-teal/70 to-aurora-teal/0" aria-hidden />
          <h3 id={`pub-${p.id}`} className="font-semibold text-white group-hover:underline">
            {p.title}
          </h3>
          {p.authors && p.authors.length > 0 ? (
            <p className="mt-1 text-sm text-white/70">{p.authors.join(", ")}</p>
          ) : null}
          {(p.venue || p.year) ? (
            <p className="mt-1 text-xs text-white/60">
              {p.venue}{p.venue && p.year ? " • " : ""}{p.year || ""}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {p.open_access ? (
              <span className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] tracking-wider">OPEN ACCESS</span>
            ) : null}
            {p.award ? (
              <span className="rounded-md border border-aurora-teal/40 bg-aurora-teal/10 px-2 py-0.5 text-[10px] tracking-wider">{p.award}</span>
            ) : null}
          </div>
          <div className="mt-3 flex gap-3 text-sm">
            {p.doi ? (
              <a className="text-aurora-teal hover:underline" href={p.doi} target="_blank" rel="noopener noreferrer" aria-label="DOI link">
                DOI ↗
              </a>
            ) : null}
            {p.pdf ? (
              <a className="text-aurora-teal hover:underline" href={p.pdf} target="_blank" rel="noopener noreferrer" aria-label="PDF link">
                PDF ↗
              </a>
            ) : null}
            {p.code ? (
              <a className="text-aurora-teal hover:underline" href={p.code} target="_blank" rel="noopener noreferrer" aria-label="Code repository">
                Code ↗
              </a>
            ) : null}
          </div>
        </motion.article>
      ))}
    </div>
  );
}
