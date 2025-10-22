type TeamCardProps = {
  name: string;
  role: string;
  focus: string;
};

export function TeamCard({ name, role, focus }: TeamCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left text-white/80 shadow-circuit backdrop-blur-xl">
      <h3 className="font-display text-lg font-semibold text-white">{name}</h3>
      <p className="text-xs uppercase tracking-[0.35em] text-aurora-teal/70">{role}</p>
      <p className="mt-3 text-sm leading-relaxed text-white/70">{focus}</p>
    </article>
  );
}
