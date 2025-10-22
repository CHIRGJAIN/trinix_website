"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ResearchHero } from "@/components/research/ResearchHero";
import { ResearchTabs } from "@/components/research/ResearchTabs";
import { FiltersBar, Filters as FiltersType } from "@/components/research/FiltersBar";
import { PublishedList } from "@/components/research/PublishedList";
import { PreprintList } from "@/components/research/PreprintList";
import { OngoingTimeline } from "@/components/research/OngoingTimeline";
import { Modal } from "@/components/research/Modal";
import { formatDate } from "@/lib/formatDate";
import { useRouter, useSearchParams } from "next/navigation";

type TabId = "published" | "preprints" | "ongoing";

type PublishedPub = {
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

type PreprintPub = {
  id: string;
  title: string;
  authors: string[];
  server: string;
  identifier: string;
  version_date: string;
  pdf?: string;
  domain?: string[];
  abstract?: string;
};

type OngoingItem = {
  id: string;
  title: string;
  lead_researcher: string;
  domain?: string[];
  milestone_next: string;
  eta_quarter: string;
  brief?: string;
  spec?: string;
  series?: string;
  team?: string[];
  short_description?: string;
};

type Data = {
  published: PublishedPub[];
  preprints: PreprintPub[];
  ongoing: OngoingItem[];
};

const HASH_PREFIX = "pubs";

export function ResearchHub() {
  const [active, setActive] = useState<TabId>("published");
  const [data, setData] = useState<Data>({ published: [], preprints: [], ongoing: [] });
  type SortKey = "Newest" | "Oldest" | "Most Popular" | "A-Z" | "Z-A";
  const [filters, setFilters] = useState<FiltersType>({ q: "", year: "", domain: "", sort: "Newest" });
  const [modal, setModal] = useState<{ kind: "preprint" | "ongoing"; id: string } | null>(null);
  const router = useRouter();
  const params = useSearchParams();

  // Deep linking: read hash on mount
  useEffect(() => {
    const h = window.location.hash.replace(/^#/, "");
    const [k, v] = h.split("=");
    if (k === HASH_PREFIX && (v === "published" || v === "preprints" || v === "ongoing")) setActive(v as TabId);
  }, []);
  // Update hash on change (preserve scroll)
  useEffect(() => {
    const url = new URL(window.location.href);
    url.hash = `${HASH_PREFIX}=${active}`;
    window.history.replaceState(null, "", url);
  }, [active]);

  // Load JSON (no-store to allow hot reload during dev)
  useEffect(() => {
    let cancelled = false;
    fetch("/data/research_publications.json", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: Data) => {
        if (!cancelled) setData(j);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Derived years from published list
  const yearOptions = useMemo(() => {
    const ys = new Set<number>();
    data.published.forEach((p) => typeof p.year === "number" && ys.add(p.year));
    return Array.from(ys).sort((a, b) => b - a);
  }, [data.published]);

  // Filter + sort helpers
  const textMatch = useCallback((txt: string, q: string) => txt.toLowerCase().includes(q.toLowerCase()), []);
  const arrMatch = useCallback((arr: string[] | undefined, v: string) => {
    if (!v) return true; if (!arr) return false; return arr.some((x) => x.toLowerCase() === v.toLowerCase());
  }, []);

  const sortBy = useCallback(function sortBy<T extends { title?: string; year?: number }>(arr: T[], key: SortKey) {
    const cp = [...arr];
    if (key === "Newest") cp.sort((a, b) => (b.year || 0) - (a.year || 0));
    else if (key === "Oldest") cp.sort((a, b) => (a.year || 0) - (b.year || 0));
    else if (key === "Most Popular") cp.sort((a, b) => (b.year || 0) - (a.year || 0)); // For now, use same as newest
    else if (key === "A-Z") cp.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    else if (key === "Z-A") cp.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    return cp;
  }, []);

  // Deep linking: open modal from query (supports ?modal=<id> and optional kind)
  useEffect(() => {
    const mid = params?.get("modal");
    const mkind = params?.get("kind");
    if (!mid) return;
    if (mkind === "preprint" || mkind === "ongoing") {
      setModal({ id: mid, kind: mkind });
      setActive(mkind === "preprint" ? "preprints" : "ongoing");
      return;
    }
    // Fallback inference by id
    const isPre = data.preprints.some((x) => x.id === mid);
    const isOg = data.ongoing.some((x) => x.id === mid);
    if (isPre) { setModal({ id: mid, kind: "preprint" }); setActive("preprints"); }
    else if (isOg) { setModal({ id: mid, kind: "ongoing" }); setActive("ongoing"); }
  }, [params, data.preprints, data.ongoing]);

  const pubFiltered = useMemo(() => {
    const q = filters.q.trim();
    const items = data.published.filter((p) =>
      (q ? (textMatch(p.title || "", q) || textMatch((p.authors || []).join(", "), q) || textMatch(p.venue || "", q)) : true) &&
      (filters.year ? String(p.year) === filters.year : true) &&
      (filters.domain ? arrMatch(p.domain, filters.domain) : true)
    );
    return sortBy(items, filters.sort as SortKey);
  }, [data.published, filters, textMatch, arrMatch, sortBy]);

  const preFiltered = useMemo(() => {
    const q = filters.q.trim();
    const items = data.preprints.filter((p) =>
      (q ? (textMatch(p.title || "", q) || textMatch((p.authors || []).join(", "), q) || textMatch(p.server || "", q)) : true) &&
      (filters.domain ? arrMatch(p.domain, filters.domain) : true)
    );
    return sortBy(items, filters.sort as SortKey);
  }, [data.preprints, filters, textMatch, arrMatch, sortBy]);

  const ogFiltered = useMemo(() => {
    const q = filters.q.trim();
    const items = data.ongoing.filter((p) =>
      (q ? textMatch(p.title || "", q) : true) && (filters.domain ? arrMatch(p.domain, filters.domain) : true)
    );
    return items; // timeline not year-sorted; keep input order
  }, [data.ongoing, filters, textMatch, arrMatch]);

  function openPreprint(id: string) {
    setModal({ kind: "preprint", id });
    const url = new URL(window.location.href);
    url.searchParams.set("modal", id);
    url.searchParams.set("kind", "preprint");
    router.replace(url.toString());
    console.log("preprint_modal_open", id);
  }
  function openOngoing(id: string) {
    setModal({ kind: "ongoing", id });
    const url = new URL(window.location.href);
    url.searchParams.set("modal", id);
    url.searchParams.set("kind", "ongoing");
    router.replace(url.toString());
    console.log("ongoing_modal_open", id);
  }
  function closeModal() {
    setModal(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("modal");
    url.searchParams.delete("kind");
    router.replace(url.toString());
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-16">
      <ResearchHero />

      <div className="mt-6 flex items-center justify-between gap-4">
        <ResearchTabs active={active} onChange={setActive} />
        <FiltersBar years={yearOptions} filters={filters} onChange={setFilters} />
      </div>

      <div className="mt-8" role="region" aria-live="polite">
        <section role="tabpanel" id="pubs-panel-published" aria-labelledby="pubs-tab-published" hidden={active !== "published"}>
          <PublishedList items={pubFiltered} />
        </section>
        <section role="tabpanel" id="pubs-panel-preprints" aria-labelledby="pubs-tab-preprints" hidden={active !== "preprints"}>
          <PreprintList items={preFiltered} onOpen={openPreprint} />
        </section>
        <section role="tabpanel" id="pubs-panel-ongoing" aria-labelledby="pubs-tab-ongoing" hidden={active !== "ongoing"}>
          <OngoingTimeline items={ogFiltered} onOpen={openOngoing} />
        </section>
      </div>

      {/* Preprint Modal */}
      <Modal open={!!modal && modal.kind === "preprint"} onClose={closeModal}>
        {(() => {
          if (!modal || modal.kind !== "preprint") return null;
          const p = data.preprints.find((x) => x.id === modal.id);
          if (!p) return <div>No data.</div>;
          return (
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="modal-title" className="text-xl md:text-2xl font-semibold">{p.title}</h2>
                  <p id="modal-desc" className="mt-1 text-xs text-white/70">{p.server} • {p.identifier} • {formatDate(p.version_date, "short") || "Draft in review"}</p>
                </div>
                <button data-autofocus className="rounded-md border border-white/20 px-3 py-1 text-sm text-white/80 hover:text-white" onClick={closeModal}>Close</button>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/60">Authors</div>
                  <div className="mt-1 text-sm text-white/80">{p.authors?.join(', ') || '-'}</div>
                </div>
                {p.abstract ? (
                  <div>
                    <div className="text-xs uppercase tracking-widest text-white/60">Abstract</div>
                    <p className="mt-1 text-sm text-white/80 whitespace-pre-wrap">{p.abstract}</p>
                  </div>
                ) : null}
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/60">Manuscript</div>
                  {p.pdf ? (
                    <div className="mt-2 rounded-lg border border-white/10 overflow-hidden">
                      <iframe src={p.pdf} className="w-full" style={{ height: '75vh' }} title="Preprint PDF" />
                    </div>
                  ) : (
                    <div className="mt-2 text-white/60">No PDF available.</div>
                  )}
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    {p.pdf ? (
                      <a
                        href={p.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border border-aurora-teal/40 px-3 py-1 text-white hover:border-white"
                        onClick={() => console.log('preprint_pdf_open', p.id)}
                      >
                        Open in new tab
                      </a>
                    ) : null}
                    {p.pdf ? (
                      <a
                        href={p.pdf}
                        download
                        className="rounded-md border border-white/20 px-3 py-1 text-white/80 hover:text-white"
                        onClick={() => console.log('preprint_pdf_download', p.id)}
                      >
                        Download
                      </a>
                    ) : null}
                    {p.pdf ? (
                      <span className="text-xs text-white/50 self-center">If the viewer is blocked, use Download.</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Ongoing Modal */}
      <Modal open={!!modal && modal.kind === "ongoing"} onClose={closeModal}>
        {(() => {
          if (!modal || modal.kind !== "ongoing") return null;
          const p = data.ongoing.find((x) => x.id === modal.id);
          if (!p) return <div>No data.</div>;
          return (
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="modal-title" className="text-xl md:text-2xl font-semibold">{p.title}</h2>
                  <p id="modal-desc" className="mt-1 text-xs text-white/70">{p.series || 'Series'} • Next: {p.milestone_next} • ETA: {p.eta_quarter}</p>
                </div>
                <button data-autofocus className="rounded-md border border-white/20 px-3 py-1 text-sm text-white/80 hover:text-white" onClick={closeModal}>Close</button>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/60">Lead & Team</div>
                  <div className="mt-1 text-sm text-white/80">Lead: {p.lead_researcher}{p.team && p.team.length ? ` • Team: ${p.team.join(', ')}` : ''}</div>
                </div>
                {p.short_description ? (
                  <div>
                    <div className="text-xs uppercase tracking-widest text-white/60">Overview</div>
                    <p className="mt-1 text-sm text-white/80 whitespace-pre-wrap">{p.short_description}</p>
                  </div>
                ) : null}
                <div className="mt-2 flex gap-3 text-sm">
                  {p.brief ? (<a href={p.brief} target="_blank" rel="noopener noreferrer" className="rounded-md border border-aurora-teal/40 px-3 py-1 text-white hover:border-white">Brief</a>) : null}
                  {p.spec ? (<a href={p.spec} target="_blank" rel="noopener noreferrer" className="rounded-md border border-white/20 px-3 py-1 text-white/80 hover:text-white">Spec</a>) : null}
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
