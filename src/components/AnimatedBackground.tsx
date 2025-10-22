"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Points as PointsType } from "three";

function StellarParticles() {
  const pointsRef = useRef<PointsType>(null);
  const particles = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = elapsed * 0.015;
      pointsRef.current.rotation.x = Math.sin(elapsed * 0.1) * 0.08;
    }
  });

  return (
    <Points ref={pointsRef} positions={particles} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#3df5f2"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
      <Canvas camera={{ position: [0, 0, 6], fov: 65 }}>
        <ambientLight intensity={0.06} />
        <StellarParticles />
      </Canvas>
      <div className="absolute inset-0 bg-cosmic-gradient mix-blend-screen" />
    </div>
  );
}
