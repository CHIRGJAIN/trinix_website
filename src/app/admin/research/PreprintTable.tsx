import type { ResearchCatalogue } from "@/server/data/researchStore";

import { PreprintRow } from "@/app/admin/research/PreprintRow";

type Props = {
  entries?: ResearchCatalogue["preprints"];
};

export function PreprintTable({ entries }: Props) {
  const list = entries ?? [];

  if (!list.length) {
    return (
      <section className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-white/60">
        No preprints yet. Use the form above to stage one.
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm">
        <thead className="bg-white/5 uppercase tracking-[0.2em] text-white/60">
          <tr>
            <th scope="col" className="px-4 py-3">Title</th>
            <th scope="col" className="px-4 py-3">Server</th>
            <th scope="col" className="px-4 py-3">Identifier</th>
            <th scope="col" className="px-4 py-3">Version Date</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white/70">
          {list.map((entry) => (
            <PreprintRow key={entry.id} entry={entry} />
          ))}
        </tbody>
      </table>
    </section>
  );
}
