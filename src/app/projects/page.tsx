"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import projectsData from "@/data/projects.json";
import type { Project } from "@/types/content";

const PROJECTS = projectsData as Project[];

// Project grid removed per request; keep Universe only

export default function ProjectsPage() {
  return (
    <>
      <section id="projects-universe" className="relative">
        {/* Solar system on top (do not modify camera/logic) */}
        <UniverseEmbed />
        {/* Quick access overlay to jump to projects grid */}
        <div className="pointer-events-none absolute inset-0 z-[60]">
          <div className="pointer-events-auto absolute right-6 top-6 flex gap-3">
            <a
              href="#projects-grid"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("projects-grid");
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="rounded-full border border-aurora-teal/60 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
              aria-label="Skip to projects grid"
              title="Skip to projects"
            >
              Skip to Projects
            </a>
          </div>
        </div>
      </section>

      {/* Projects Grid (below the 3D solar system) */}
      <section id="projects-grid" className="mt-6 md:mt-10 scroll-mt-24 md:scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <h2 className="text-2xl md:text-3xl font-semibold">Projects</h2>
          <p className="mt-1 text-sm text-white/70">Explore live platforms and upcoming launches across domains.</p>
          <div
            className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            aria-label="Project summaries"
          >
            {PROJECTS.map((project) => {
              const ctas =
                project.ctas && project.ctas.length > 0
                  ? project.ctas
                  : project.link
                  ? [{ label: "Explore", href: project.link }]
                  : [];
              const primaryHref = ctas[0]?.href ?? project.link ?? "#";
              const statusLabel =
                typeof project.status === "string" ? project.status.toUpperCase() : "IN PROGRESS";
              const domainLabel = project.domain ?? "Multidisciplinary";

              return (
                <article
                  key={project.id ?? project.name}
                  role="article"
                  aria-labelledby={`proj-${slugify(project.name)}-title`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      window.location.href = primaryHref;
                    }
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden hover:shadow-2xl hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
                >
                  <div className="p-5 md:p-6">
                    <div className="flex items-center justify-between text-xs tracking-wide uppercase">
                      <span
                        aria-label={`Status: ${statusLabel}`}
                        className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-white/80"
                      >
                        {statusLabel}
                      </span>
                      <span aria-label={`Domain: ${domainLabel}`} className="text-white/60">
                        {domainLabel}
                      </span>
                    </div>
                    <h3 id={`proj-${slugify(project.name)}-title`} className="mt-3 text-xl md:text-2xl font-semibold">
                      <Link
                        href={primaryHref}
                        className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60 rounded-md"
                      >
                        {project.name}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm text-white/70">{project.summary}</p>
                    {project.keyFeatures && project.keyFeatures.length > 0 ? (
                      <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-white/80">
                        {project.keyFeatures.map((feature, index) => (
                          <li key={`${project.id}-feature-${index}`}>{feature}</li>
                        ))}
                      </ul>
                    ) : null}
                    {ctas.length > 0 ? (
                      <div className="flex gap-3 pt-4">
                        {ctas.map((cta, index) => (
                          <Link
                            key={`${project.id}-cta-${index}`}
                            href={cta.href}
                            className={
                              index === 0
                                ? "rounded-md border border-aurora-teal/40 px-3 py-1 text-sm text-white hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
                                : "rounded-md border border-white/20 px-3 py-1 text-sm text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
                            }
                            aria-label={`${cta.label} ${project.name}`}
                          >
                            {cta.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

const UniverseEmbed = dynamic(
  () => import("@/components/3d/ProjectUniverse").then((m) => {
    const C = () => <m.ProjectUniverse renderBelowDetails={true} />;
    return C;
  }),
  { ssr: false, loading: () => null }
);

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
