type ResearchCardProps = {
  title: string;
  summary: string;
  year: number;
  link?: string;
  category: "Preprint" | "Published";
};

export function ResearchCard({ title, summary, year, link = "#", category }: ResearchCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 text-left text-white/80 backdrop-blur-xl">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-aurora-teal/70">
          <span className="rounded-full border border-aurora-teal/40 bg-aurora-teal/10 px-3 py-1 text-[0.6rem]">
            {category}
          </span>
          <span className="text-white/50">{year}</span>
        </div>
        <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-white/70">{summary}</p>
      </div>
      <a
        href={link}
        className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-aurora-teal transition hover:text-white"
      >
        View Paper
        <span aria-hidden>→</span>
      </a>
    </article>
  );
}

