import type { ResearchCatalogue } from "@/server/data/researchStore";

import { OngoingRow } from "@/app/admin/research/OngoingRow";

type Props = {
  entries?: ResearchCatalogue["ongoing"];
};

export function OngoingTable({ entries }: Props) {
  const list = entries ?? [];

  if (!list.length) {
    return (
      <section className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-white/60">
        No ongoing initiatives logged yet. Capture the current roadmap using the form above.
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm">
        <thead className="bg-white/5 uppercase tracking-[0.2em] text-white/60">
          <tr>
            <th scope="col" className="px-4 py-3">Title</th>
            <th scope="col" className="px-4 py-3">Next Milestone</th>
            <th scope="col" className="px-4 py-3">ETA</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white/70">
          {list.map((entry) => (
            <OngoingRow key={entry.id} entry={entry} />
          ))}
        </tbody>
      </table>
    </section>
  );
}
