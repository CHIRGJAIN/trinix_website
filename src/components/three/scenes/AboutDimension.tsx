"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useAbout } from "@/state/about";

export function AboutDimension() {
  const { activeIndex, journeyInView } = useAbout();
  const ringMatsRef = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const milestones = useMemo(() => {
    return new Array(7).fill(0).map((_, i) => ({
      x: (i - 3) * 2.4,
      height: 1.2 + Math.sin(i * 1.3) * 0.6 + i * 0.12,
      color: i % 2 ? "#4cc9f0" : "#a26bff",
    }));
  }, []);

  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.15) * 2.2;
    camera.position.y = 0.3 + Math.sin(t * 0.3) * 0.2;
    camera.lookAt(0, 0.5, 0);

    // Gentle pulse on the active ring only
    const map: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 };
    for (let i = 0; i < ringMatsRef.current.length; i++) {
      const mat = ringMatsRef.current[i];
      if (!mat) continue;
      const milestoneIdx = map[i as keyof typeof map];
      const isActive = journeyInView && milestoneIdx !== undefined && activeIndex === milestoneIdx;
      if (isActive) {
        const base = 3.0;
        const amp = 0.25; // subtle pulse
        const speed = 1.2;
        mat.emissiveIntensity = base + amp * Math.sin(t * speed);
      } else {
        mat.emissiveIntensity = 1.6;
      }
    }
  });

  return (
    <group>
      {milestones.map((m, i) => {
        const map: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 };
        const milestoneIdx = map[i as keyof typeof map];
        const isActive = journeyInView && milestoneIdx !== undefined && activeIndex === milestoneIdx;
        return (
          <group key={i} position={[m.x, m.height / 2 - 0.4, -i * 0.1]}>
            <mesh castShadow>
              <boxGeometry args={[0.6, m.height, 0.6]} />
              <meshStandardMaterial
                color="#0a0a0a"
                metalness={0.2}
                roughness={0.4}
                emissive={isActive ? new THREE.Color(m.color) : new THREE.Color(0x000000)}
                emissiveIntensity={isActive ? 0.16 : 0}
              />
            </mesh>
            <mesh position={[0, m.height / 2 + 0.2, 0]}>
              <torusGeometry args={[0.28, 0.008, 16, 64]} />
              <meshStandardMaterial
                ref={(mat) => (ringMatsRef.current[i] = mat)}
                emissive={new THREE.Color(m.color)}
                emissiveIntensity={isActive ? 3.0 : 1.6}
                color="#0b0b12"
              />
            </mesh>
          </group>
        );
      })}
      <pointLight position={[0, 2, 3]} intensity={4} color="#4cc9f0" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
        <planeGeometry args={[40, 10]} />
        <meshStandardMaterial color="#0b0b12" />
      </mesh>
    </group>
  );
}
