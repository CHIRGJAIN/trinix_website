"use client";

export type Filters = {
  q: string;
  year: string;
  domain: string;
  sort: "Newest" | "Oldest" | "Most Popular" | "A-Z" | "Z-A";
};

export function FiltersBar({
  years,
  filters,
  onChange,
}: {
  years: number[];
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-end">
      <input
        aria-label="Search publications"
        placeholder="Search title, authors, venue…"
        className="w-full md:w-72 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
        value={filters.q}
        onChange={(e) => onChange({ ...filters, q: e.target.value })}
      />
      <select
        aria-label="Filter by year"
        className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
        value={filters.year}
        onChange={(e) => onChange({ ...filters, year: e.target.value })}
        style={{ colorScheme: 'dark' }}
      >
        <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>All years</option>
        <option value="2024-2025" style={{ backgroundColor: '#1f2937', color: 'white' }}>2024-2025</option>
        {years.map((y) => (
          <option key={y} value={y} style={{ backgroundColor: '#1f2937', color: 'white' }}>
            {y}
          </option>
        ))}
      </select>
      <select
        aria-label="Filter by domain"
        className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60 [&>option]:bg-gray-900 [&>option]:text-white"
        value={filters.domain}
        onChange={(e) => onChange({ ...filters, domain: e.target.value })}
      >
        <option value="">All domains</option>
        {[
          "Finance",
          "Vedic",
          "Psychology",
          "AI",
          "ML",
          "DS",
          "CV",
          "NLP",
          "FinTech",
          "HealthTech",
          "Sustainability",
          "Quantum",
          "Computer Vision",
        ].map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        aria-label="Sort publications"
        className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60 [&>option]:bg-gray-900 [&>option]:text-white"
        value={filters.sort}
        onChange={(e) => onChange({ ...filters, sort: e.target.value as Filters["sort"] })}
      >
        {(["Newest", "Oldest", "Most Popular", "A-Z", "Z-A"] as const).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}

