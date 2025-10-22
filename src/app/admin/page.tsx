import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 text-white">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold">Welcome to the Trinix Admin Console</h1>
        <p className="text-sm text-white/70">
          Use the navigation to manage blog entries, open roles, featured projects, and research highlights. Editing
          capabilities will roll out in upcoming phases.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <AdminCard
          title="Blog Overview"
          description="Review the latest posts, their publication dates, and authors."
          href="/admin/blog"
        />
        <AdminCard
          title="Careers Pipeline"
          description="Publish new roles, refine job details, and keep opportunities current."
          href="/admin/careers"
        />
        <AdminCard
          title="Projects Directory"
          description="Track live and in-flight initiatives showcased on the public site."
          href="/admin/projects"
        />
        <AdminCard
          title="Research Library"
          description="See published papers, preprints, and ongoing research signals."
          href="/admin/research"
        />
      </section>
    </div>
  );
}

function AdminCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
    >
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-white/70">{description}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-aurora-teal transition group-hover:text-white">
        View section
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
