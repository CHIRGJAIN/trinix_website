type JobCardProps = {
  title: string;
  location: string;
  type: string;
  description: string;
  link?: string;
  onApply?: () => void;
};

export function JobCard({ title, location, type, description, link = "#", onApply }: JobCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 text-left text-white/80 backdrop-blur-xl">
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
        <p className="text-xs uppercase tracking-[0.35em] text-aurora-teal/70">
          {location} • {type}
        </p>
        <p className="text-sm leading-relaxed text-white/70">{description}</p>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.3em]">
        <a
          href={link}
          className="inline-flex items-center gap-2 text-aurora-teal transition hover:text-white"
        >
          View Role
          <span aria-hidden>→</span>
        </a>
        {onApply && (
          <button
            type="button"
            onClick={onApply}
            className="rounded-full border border-aurora-teal/50 px-4 py-2 text-[0.6rem] text-white transition hover:border-white"
          >
            Apply
          </button>
        )}
      </div>
    </article>
  );
}

