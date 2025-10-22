"use client";

import { EffectComposer, Bloom, Vignette, Noise, DepthOfField, GodRays, BrightnessContrast } from "@react-three/postprocessing";
import { usePathname } from "next/navigation";
import { BlendFunction } from "postprocessing";
import { useEffects } from "@/state/effects";

export function PostFX() {
  const sun = useEffects((s) => s.sun);
  const exposure = useEffects((s) => s.exposure);
  const contrast = useEffects((s) => s.contrast);
  const bloomMul = useEffects((s) => s.bloom);
  const pathname = usePathname();
  const isUniverse = pathname?.startsWith("/universe");
  return (
    <EffectComposer>
      <Bloom intensity={1.1 * bloomMul} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
      {isUniverse ? (
        <BrightnessContrast brightness={exposure} contrast={contrast} />
      ) : (
        <></>
      )}
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.035} />
      <Vignette eskil offset={0.2} darkness={0.6} />
      <DepthOfField focusDistance={0.015} focalLength={0.03} bokehScale={2} />
      {isUniverse && sun ? (
        // @ts-expect-error third-party typing accepts Object3D
        <GodRays sun={sun} samples={60} density={0.9} decay={0.97} weight={0.3} exposure={0.4} clampMax={1.0} blur />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
