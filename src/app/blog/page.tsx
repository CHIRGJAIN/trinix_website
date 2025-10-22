'use client';

import { useEffect, useMemo, useState } from "react";

import { POSTS } from "@/data/blogPosts";
import { formatDate } from "@/lib/formatDate";

const BASE_PLACEHOLDER = "This section will host long-form narrative weaving Vedic insights with quantum-native engineering chronicles.";
const PLACEHOLDER_PARAGRAPHS = Array.from({ length: 6 }, (_, index) =>
  `${BASE_PLACEHOLDER} Paragraph ${index + 1} remains open for high-fidelity storytelling, diagrams, and embedded simulations.`
);

const buildContent = (custom?: string[]) => {
  if (!custom || custom.length === 0) {
    return [...PLACEHOLDER_PARAGRAPHS];
  }

  const filled = [...custom];
  for (let index = custom.length; index < PLACEHOLDER_PARAGRAPHS.length; index += 1) {
    filled.push(PLACEHOLDER_PARAGRAPHS[index]);
  }

  return filled.slice(0, PLACEHOLDER_PARAGRAPHS.length);
};

const POST_COPY: Record<string, string[]> = {
  "vedic-ai-living-mantras": buildContent([
    "From ritual-responsive datasets to explainable autonomy, our Vedic AI research continues to bridge classical heuristics with quantum-led inference.",
    "We prototype mantra-aligned embeddings that stabilize large models while preserving cultural nuance.",
    "The resulting systems demonstrate how human-first governance can co-exist with aggressive experimentation."
  ]),
  "quantum-k8s-flight": buildContent([
    "Our flight plans extend Kubernetes beyond deterministic scheduling, introducing probabilistic meshes for quantum workloads.",
    "Each pod adjusts to decoherence risk, balancing speed with fidelity while remaining observable across clusters.",
    "The roadmap covers integration hooks, governance dashboards, and partnerships already piloting these fabrics."
  ]),
  "neural-yantras": buildContent([
    "Neural Yantras recombine sacred geometry with adaptive UI gradients, unlocking ergonomics rooted in ancient design systems.",
    "As interactions intensify, glow circuits respond to intent, nudging experiences that feel ceremonial yet contemporary.",
    "We break down the primitives, shader stacks, and motion heuristics making these interfaces tangible."
  ]),
  "autonomous-pods": buildContent([
    "Polymath pods require orchestration that respects context, cadence, and sovereignty.",
    "We outline how Trinix configures pods for research ops, weaving AI agents, subject matter leads, and cultural stewards together.",
    "This article documents templates, metrics, and rituals sustaining pod velocity without burning out teams."
  ]),
  "copper-gold-economics": buildContent([
    "Quantum finance is carving new equilibria where copper-gold metaphors reflect data gravity and liquidity flow.",
    "We unpack hybrid ledgers, simulation tooling, and compliance overlays enabling programmable finance pilots.",
    "Expect annotated diagrams and references to partners stress-testing these rails today."
  ]),
  "k8s-glow-security": buildContent([
    "Aurora Glow upgrades Kubernetes posture by infusing Vedic threat modeling with automated remediation.",
    "We detail the risk atlas, detection heuristics, and narrative dashboards translating incidents into shared learning.",
    "This piece closes with implementation notes for enterprises rolling out self-healing clusters."
  ])
};

const SUMMARY_TITLE = "AI Summary Placeholder";
const SUMMARY_BODY =
  "Reserve this space for animated AI-assisted recaps, voiceovers, or interactive question-answer overlays.";

export default function BlogIndexPage() {
  const posts = POSTS;
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const activePost = useMemo(() => posts.find((post) => post.slug === activeSlug) ?? null, [activeSlug, posts]);
  const activeContent = useMemo(
    () => [...(activeSlug ? POST_COPY[activeSlug] ?? PLACEHOLDER_PARAGRAPHS : PLACEHOLDER_PARAGRAPHS)],
    [activeSlug]
  );

  const activeMeta = useMemo(() => {
    if (!activePost) return "Metadata forthcoming";
    const pieces: string[] = [];
    if (activePost.author?.trim()) {
      pieces.push(activePost.author.trim());
    }
    const publicationSource = activePost.publication_date || activePost.published_at;
    if (publicationSource) {
      pieces.push(formatDate(publicationSource, "long") || publicationSource);
    }
    if (activePost.estimated_read_duration?.trim()) {
      pieces.push(activePost.estimated_read_duration.trim());
    }
    return pieces.length ? pieces.join(" • ") : "Metadata forthcoming";
  }, [activePost]);

  const activeDescription = useMemo(() => {
    if (!activePost?.description_points) return null;
    const points = activePost.description_points.map((point) => point.trim()).filter((point) => point.length > 0);
    if (!points.length) return null;
    return points.join(" ");
  }, [activePost]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!activePost) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveSlug(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePost]);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(61,245,242,0.12),transparent_65%)]" />
      <div className="mx-auto max-w-6xl space-y-16 px-6 py-24 text-white md:px-10">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-aurora-teal/80">Signal Threads</p>
          <h1 className="font-display text-4xl font-semibold md:text-5xl">Insights from the Trinix Lab</h1>
          <p className="max-w-2xl text-sm text-white/70">
            Deep dives into Vedic-aligned intelligence, quantum-native infrastructure, and the ecosystems we build with our partners.
            Explore the narratives behind each breakthrough.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => {
            const publicationSource = post.publication_date || post.published_at;
            const publishedLabel = publicationSource ? formatDate(publicationSource, "short") ?? publicationSource : undefined;
            const metaParts: string[] = [];
            if (post.author?.trim()) {
              metaParts.push(post.author.trim());
            }
            if (post.estimated_read_duration?.trim()) {
              metaParts.push(post.estimated_read_duration.trim());
            }
            const metaLabel = metaParts.join(" • ");

            return (
              <button
                key={post.slug}
                type="button"
                onClick={() => setActiveSlug(post.slug)}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-left text-white/80 shadow-aurora backdrop-blur-xl transition hover:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-aurora-teal/10 via-transparent to-copper-gold/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="text-xs uppercase tracking-[0.3em] text-aurora-teal/70">Entry {index + 1}</span>
                <h2 className="mt-4 font-display text-2xl font-semibold text-white">{post.title}</h2>
                <p className="mt-3 text-sm text-white/70">{post.blurb}</p>
                {metaLabel ? (
                  <p className="mt-4 text-xs uppercase tracking-[0.25em] text-white/60">{metaLabel}</p>
                ) : null}
                <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/50">
                  {publishedLabel ? <span>{publishedLabel}</span> : <span>Publish window</span>}
                  <span className="inline-flex items-center gap-2 text-aurora-teal group-hover:text-white">
                    Read
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </button>
            );
          })}
        </section>
      </div>

      {activePost ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl px-6 py-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-modal-title"
          onClick={() => setActiveSlug(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-white/8 p-6 text-white shadow-aurora backdrop-blur-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveSlug(null)}
              className="absolute right-4 top-4 rounded-full border border-white/20 px-3 py-1 text-sm text-white/80 transition hover:text-white"
              aria-label="Close article"
            >
              ×
            </button>

            <p className="text-xs uppercase tracking-[0.3em] text-aurora-teal/70">Signal Thread</p>
            <h2 id="blog-modal-title" className="mt-3 font-display text-3xl font-semibold text-white">
              {activePost.title}
            </h2>
            <p className="mt-2 text-sm text-white/60">
              {(() => {
                const publicationSource = activePost.publication_date || activePost.published_at;
                if (!publicationSource) return "Publication date forthcoming";
                return formatDate(publicationSource, "long") ?? publicationSource;
              })()}
            </p>
            <p className="mt-2 text-sm text-white/50">{activeMeta}</p>
            {activeDescription ? (
              <p className="mt-3 text-sm leading-relaxed text-white/70">{activeDescription}</p>
            ) : null}

            <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-6 text-sm leading-relaxed text-white/80">
                <div className="space-y-4">
                  {activeContent.map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/75 backdrop-blur-xl">
                  <p className="font-display text-lg text-white">{SUMMARY_TITLE}</p>
                  <p className="mt-2">{SUMMARY_BODY}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

