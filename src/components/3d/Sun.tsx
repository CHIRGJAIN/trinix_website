"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffects } from "@/state/effects";

export function Sun() {
  const ref = useRef<THREE.Mesh>(null!);
  const setSun = useEffects((s) => s.setSun);
  useEffect(() => {
    if (ref.current) setSun(ref.current);
    return () => setSun(null);
  }, [setSun]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.05;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]} raycast={() => null}>
      <sphereGeometry args={[6.81 * 1.25 + 2, 64, 64]} />
      <meshStandardMaterial
        color="#f0b35a"
        emissive="#f0b35a"
        emissiveIntensity={0.6}
        metalness={0.2}
        roughness={0.4}
      />
    </mesh>
  );
}
