"use client";

import { ReactNode, Suspense, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { PostFX } from "@/components/three/PostFX";

export function CanvasStage({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const dpr = useMemo<[number, number]>(() => {
    if (typeof window === "undefined") {
      return [1, 1.5];
    }
    const deviceRatio = window.devicePixelRatio || 1;
    return deviceRatio <= 2 ? [1, 1] : [1, 1.5];
  }, []);
  // Avoid mounting a second Canvas on routes that render their own R3F scenes
  if (pathname?.startsWith("/projects") || pathname?.startsWith("/universe")) {
    return null;
  }
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        dpr={dpr}
        gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping }}
        camera={{ position: [0, 0, 8], fov: 50 }}
        shadows
      >
        <color attach="background" args={["#040409"]} />
        <fog attach="fog" args={["#040409", 12, 30]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />

        <Suspense fallback={null}>{children}</Suspense>
        <PostFX />
      </Canvas>
    </div>
  );
}
