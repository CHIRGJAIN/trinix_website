"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";

import { AnimatedBackground } from "@/components/AnimatedBackground";
import projects from "@/data/projects.json";
import { POSTS } from "@/data/blogPosts";
import { formatDate } from "@/lib/formatDate";
import type { Project } from "@/types/content";
import researchPublications from "@/../public/data/research_publications.json";

type ResearchPublication = {
  id: string;
  title: string;
  authors?: string[];
  venue?: string;
  doi?: string;
  open_access?: boolean;
  domain?: string[];
};

type ResearchPreprint = {
  id: string;
  title: string;
  authors?: string[];
  server?: string;
  identifier?: string;
  version_date?: string;
  pdf?: string;
};

type ResearchOngoing = {
  id: string;
  title: string;
  milestone_next?: string;
  eta?: string;
};

type ResearchDataset = {
  published?: ResearchPublication[];
  preprints?: ResearchPreprint[];
  ongoing?: ResearchOngoing[];
};

type ResearchHighlight =
  | { category: "Published"; item: ResearchPublication }
  | { category: "Pre-prints"; item: ResearchPreprint }
  | { category: "On-going"; item: ResearchOngoing };

export default function Home() {
  const projectEntries = projects as Project[];
  const featuredProjects = useMemo(() => selectFeaturedProjects(projectEntries), [projectEntries]);
  const latestPosts = useMemo(() => selectLatestPosts(POSTS, 6), []);
  const researchHighlights = useMemo(() => selectResearchHighlights(researchPublications as ResearchDataset, 3), []);

  return (
    <div className="relative overflow-hidden">
      <AnimatedBackground />
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 md:px-10 pt-24 pb-12 md:pb-16" aria-labelledby="home-hero-title">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto space-y-6 text-white text-center"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-aurora-teal/80">Intelligence • Research • Delivery</p>
            <h1 id="home-hero-title" className="font-display text-4xl leading-tight md:text-5xl">
              Trinix — Building Intelligent Systems
            </h1>
            <p className="text-base text-white/70 md:text-lg">
              We create advanced digital platforms and research-led technology that help organizations move faster,
              safer, and smarter.
            </p>
            <p className="text-sm text-white/60 md:text-base">
              From real-time emergency networks to property tech and fintech research, our work blends engineering rigor
              with ambitious product vision.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Link
                href="/projects"
                className="group relative inline-flex items-center justify-center rounded-full border border-aurora-teal/60 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-core/60 via-aurora-teal/70 to-copper-gold/70 opacity-0 transition group-hover:opacity-100" />
                <span className="relative">Explore Projects</span>
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
              >
                Read the Blog
              </Link>
            </div>
          </motion.div>
        </section>

        <section
          className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16"
          aria-labelledby="home-ideology-heading"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 text-white text-center"
          >
            <h2 id="home-ideology-heading" className="font-display text-3xl font-semibold md:text-4xl">
              Our Ideology
            </h2>
            <p className="max-w-4xl mx-auto text-base leading-relaxed text-white/70 md:text-lg">
              Innovation flourishes when people are empowered. At Trinix, we combine creativity, cutting-edge
              engineering, and rigorous research to build platforms that solve real problems. We invest in ideas,
              provide teams with infrastructure and mentorship, and scale what works—sustainably and transparently. Our
              multidisciplinary approach lets us move from concept to impact while keeping ethics, performance, and user
              trust at the core.
            </p>
          </motion.div>
        </section>

        <section
          id="featured-projects"
          className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16"
          aria-labelledby="featured-projects-heading"
        >
          <div className="flex flex-col gap-4 text-white md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="featured-projects-heading" className="font-display text-3xl font-semibold md:text-4xl">
                Featured Projects
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">
                A snapshot of live and emerging initiatives across emergency response, healthcare, and research labs.
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-aurora-teal transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
            >
              See all projects
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
            aria-label="Featured project summaries"
          >
            {featuredProjects.map((project) => (
              <article
                key={project.id ?? project.name}
                role="article"
                aria-labelledby={`featured-project-${slugify(project.name)}-title`}
                className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-aurora backdrop-blur-xl focus-within:border-white/20"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    const href = project.ctas?.[0]?.href ?? project.link ?? "/projects";
                    window.location.href = href;
                  }
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
                    <span className="rounded-full border border-aurora-teal/40 bg-aurora-teal/10 px-3 py-1 text-aurora-teal">
                      {project.status?.toUpperCase() ?? "IN PROGRESS"}
                    </span>
                    <span className="truncate text-white/50">{project.domain ?? "Multidisciplinary"}</span>
                  </div>
                  <h3
                    id={`featured-project-${slugify(project.name)}-title`}
                    className="font-display text-xl font-semibold md:text-2xl"
                  >
                    {project.name}
                  </h3>
                  <p className="text-sm text-white/70">{project.summary}</p>
                  {project.keyFeatures && project.keyFeatures.length > 0 ? (
                    <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-white/80">
                      {project.keyFeatures.slice(0, 3).map((feature, index) => (
                        <li key={`${project.id}-feature-${index}`}>{feature}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className="mt-6 flex flex-wrap gap-3 text-sm uppercase tracking-[0.25em]">
                  {deriveProjectCtas(project).map((cta, index) => (
                    <Link
                      key={`${project.id}-cta-${cta.label}`}
                      href={cta.href}
                      className={
                        index === 0
                          ? "rounded-md border border-aurora-teal/50 px-3 py-1 text-white transition hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
                          : "rounded-md border border-white/20 px-3 py-1 text-white/80 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
                      }
                    >
                      {cta.label}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16" aria-labelledby="home-blog-heading">
          <div className="flex flex-col gap-4 text-white md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="home-blog-heading" className="font-display text-3xl font-semibold md:text-4xl">
                Latest from the Blog
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/70 md:text-base">
                Insights, announcements, and research notes from the Trinix team.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-aurora-teal transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
            >
              View all posts
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Latest blog posts">
            {latestPosts.map((post, index) => (
              <article
                key={post.slug}
                role="article"
                aria-labelledby={`home-blog-${index}-title`}
                className="group relative overflow-hidden rounded-3xl border border-white/12 bg-black/40 p-6 text-white shadow-aurora backdrop-blur-xl transition hover:border-white/25 focus-within:border-white/25"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(61,245,242,0.18),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex flex-col gap-4">
                  <div className="text-xs uppercase tracking-[0.3em] text-aurora-teal/80">Latest Insight</div>
                  <h3 id={`home-blog-${index}-title`} className="font-display text-xl font-semibold text-white">
                    {post.title}
                  </h3>
                  <p className="text-sm text-white/70">{post.blurb}</p>
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/50">
                    <span>{post.author}</span>
                    <span>{post.publishedLabel}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-aurora-teal transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
                  >
                    Read post
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16"
          aria-labelledby="home-research-heading"
        >
          <div className="flex flex-col gap-4 text-white md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="home-research-heading" className="font-display text-3xl font-semibold md:text-4xl">
                Research Highlights
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">
                Work spanning published papers, pre-print investigations, and ongoing experiments across domains.
              </p>
            </div>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-aurora-teal transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
            >
              Explore Research
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Research highlights">
            {researchHighlights.map((highlight) => (
              <article
                key={`${highlight.category}-${highlight.item.id}`}
                className="flex h-full flex-col gap-4 rounded-3xl border border-white/12 bg-white/5 p-6 text-white backdrop-blur-xl focus-within:border-white/25"
                role="article"
              >
                <div className="text-xs uppercase tracking-[0.3em] text-aurora-teal/80">{highlight.category}</div>
                {renderResearchContent(highlight)}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function selectFeaturedProjects(projectsList: Project[]): Project[] {
  if (!Array.isArray(projectsList)) return [];
  const live = projectsList.filter((project) => project.status?.toLowerCase() === "live");
  const nonLive = projectsList.filter((project) => project.status?.toLowerCase() !== "live");
  return [...live, ...nonLive].slice(0, 3);
}

function deriveProjectCtas(project: Project) {
  const ctas = [] as { label: string; href: string }[];
  const primaryHref = project.ctas?.[0]?.href ?? project.link ?? "/projects";
  if (primaryHref) {
    ctas.push({ label: "Explore", href: primaryHref });
  }
  const secondaryHref = project.ctas?.[1]?.href;
  if (secondaryHref) {
    ctas.push({ label: "Details", href: secondaryHref });
  }
  return ctas;
}

function selectLatestPosts(posts: typeof POSTS, count: number) {
  return [...posts]
    .sort((a, b) => {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : -Infinity;
      const dateB = b.published_at ? new Date(b.published_at).getTime() : -Infinity;
      return dateB - dateA;
    })
    .slice(0, count)
    .map((post) => ({
      ...post,
      author: (post as unknown as { author?: string }).author ?? "Trinix Lab",
      publishedLabel: formatDate(post.published_at, "short") || "Coming soon",
    }));
}

function selectResearchHighlights(dataset: ResearchDataset, maxHighlights: number): ResearchHighlight[] {
  if (!dataset) return [];
  const highlights: ResearchHighlight[] = [];

  if (dataset.published && dataset.published.length > 0) {
    highlights.push({ category: "Published", item: dataset.published[0] });
  }
  if (dataset.preprints && dataset.preprints.length > 0) {
    highlights.push({ category: "Pre-prints", item: dataset.preprints[0] });
  }
  if (dataset.ongoing && dataset.ongoing.length > 0) {
    highlights.push({ category: "On-going", item: dataset.ongoing[0] });
  }

  return highlights.slice(0, maxHighlights);
}

function renderResearchContent(highlight: ResearchHighlight) {
  if (highlight.category === "Published") {
    const { item } = highlight;
    return (
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="space-y-3">
          <h3 className="font-display text-xl font-semibold text-white">{item.title}</h3>
          <p className="text-sm text-white/70">
            {item.venue ? `${item.venue}${item.domain?.length ? " • " : ""}` : "Published work"}
            {item.domain?.join(", ")}
          </p>
          {item.authors && item.authors.length > 0 ? (
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">{item.authors.join(", ")}</p>
          ) : null}
        </div>
        {item.doi ? (
          <a
            href={item.doi}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-aurora-teal transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
          >
            View publication
            <span aria-hidden>↗</span>
          </a>
        ) : null}
      </div>
    );
  }

  if (highlight.category === "Pre-prints") {
    const { item } = highlight;
    return (
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="space-y-3">
          <h3 className="font-display text-xl font-semibold text-white">{item.title}</h3>
          <div className="space-y-2 text-sm text-white/70">
            <p>{item.server}</p>
              <p>{item.version_date ? formatDate(item.version_date, "short") : "Draft in review"}</p>
          </div>
          {item.identifier ? (
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">{item.identifier}</p>
          ) : null}
        </div>
        {item.pdf ? (
          <Link
            href={item.pdf}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-aurora-teal transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
          >
            Open PDF
            <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
    );
  }

  const { item } = highlight;
  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <div className="space-y-3">
        <h3 className="font-display text-xl font-semibold text-white">{item.title}</h3>
        <p className="text-sm text-white/70">{item.milestone_next ?? "Next milestone forthcoming"}</p>
      </div>
      <p className="text-xs uppercase tracking-[0.25em] text-white/50">ETA: {item.eta ?? "TBA"}</p>
    </div>
  );
}

function slugify(source: string) {
  return source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}


