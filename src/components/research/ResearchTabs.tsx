"use client";

import { useEffect, useMemo, useRef } from "react";

type TabId = "published" | "preprints" | "ongoing";

export function ResearchTabs({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  const tabs: { id: TabId; label: string }[] = useMemo(
    () => [
      { id: "published", label: "Published Papers" },
      { id: "preprints", label: "Pre-prints" },
      { id: "ongoing", label: "On-going" },
    ],
    []
  );
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    function onKey(e: KeyboardEvent) {
      const idx = tabs.findIndex((t) => t.id === active);
      if (e.key === "ArrowRight") {
        const next = tabs[(idx + 1) % tabs.length];
        onChange(next.id);
      } else if (e.key === "ArrowLeft") {
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        onChange(prev.id);
      } else if (e.key === "Home") {
        onChange(tabs[0].id);
      } else if (e.key === "End") {
        onChange(tabs[tabs.length - 1].id);
      }
    }
    list.addEventListener("keydown", onKey);
    return () => list.removeEventListener("keydown", onKey);
  }, [active, onChange, tabs]);

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Research categories"
      className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-md"
    >
      {tabs.map((t) => {
        const selected = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            id={`pubs-tab-${t.id}`}
            aria-selected={selected}
            aria-controls={`pubs-panel-${t.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={`px-4 md:px-6 py-2 rounded-xl text-sm md:text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60 ${
              selected ? "bg-white/15 text-white" : "text-white/70 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

