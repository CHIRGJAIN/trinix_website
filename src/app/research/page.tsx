import { Suspense } from "react";
import { ResearchHub } from "@/components/research/ResearchHub";

export default function ResearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 md:px-10 py-10 text-white/60">Loading…</div>}>
      <ResearchHub />
    </Suspense>
  );
}
