"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";
import { usePathname } from "next/navigation";

const ResearchNexus = dynamic(() => import("@/components/three/scenes/ResearchNexus").then((mod) => mod.ResearchNexus), {
  ssr: false,
  loading: () => null,
});

const AboutDimension = dynamic(() => import("@/components/three/scenes/AboutDimension").then((mod) => mod.AboutDimension), {
  ssr: false,
  loading: () => null,
});

// Universe scene is rendered directly by the /universe page via dynamic import

export function SceneRouter() {
  const pathname = usePathname();
  const scene = useMemo(() => {
    if (pathname?.startsWith("/research")) return <ResearchNexus />;
    if (pathname?.startsWith("/about")) return <AboutDimension />;
    return null;
  }, [pathname]);

  return <Suspense fallback={null}>{scene}</Suspense>;
}
