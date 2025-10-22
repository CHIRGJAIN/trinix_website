type ProjectCardProps = {
  name: string;
  summary: string;
  link?: string;
};

export function ProjectCard({ name, summary, link = "#" }: ProjectCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 text-left text-white shadow-aurora backdrop-blur-xl">
      <div className="space-y-4">
        <h3 className="font-display text-xl font-semibold text-white">{name}</h3>
        <p className="text-sm text-white/70">{summary}</p>
      </div>
      <div className="mt-8 flex justify-end">
        <a href={link} className="inline-flex items-center gap-1 text-sm uppercase tracking-[0.2em] text-aurora-teal transition hover:text-white">
          Learn More
          <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  );
}
