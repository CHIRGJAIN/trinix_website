"use client";

import { EffectComposer, Bloom, Vignette, Noise, DepthOfField, GodRays, BrightnessContrast } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { usePathname } from "next/navigation";
import { useEffects } from "@/state/effects";

export function UniverseFX() {
  const sun = useEffects((s) => s.sun);
  const pathname = usePathname();
  const isUniverse = pathname?.startsWith("/universe") || pathname?.startsWith("/projects");
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  return (
    <EffectComposer>
      {/* Tuned for readability */}
      <Bloom intensity={0.55} luminanceThreshold={0.6} luminanceSmoothing={0.8} mipmapBlur />
      {isUniverse ? <BrightnessContrast brightness={0.04} contrast={0.05} /> : <></>}
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.02} />
      <Vignette eskil offset={0.2} darkness={0.5} />
      {!isMobile ? <DepthOfField focusDistance={0.02} focalLength={0.02} bokehScale={1.3} /> : <></>}
      {isUniverse && sun ? (
        // @ts-expect-error library types accept Object3D
        <GodRays sun={sun} samples={48} density={0.85} decay={0.96} weight={0.22} exposure={0.38} clampMax={1.0} blur />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
