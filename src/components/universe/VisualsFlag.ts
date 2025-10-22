"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export type VisualsMode = "legacy" | "enhanced";

export function useVisualsMode(): VisualsMode {
  const params = useSearchParams();
  const query = params?.get("visuals");
  const envMode = (process.env.NEXT_PUBLIC_UNIVERSE_VISUALS as VisualsMode) || "enhanced";
  return useMemo(() => (query === "legacy" || query === "enhanced" ? (query as VisualsMode) : envMode), [query, envMode]);
}

