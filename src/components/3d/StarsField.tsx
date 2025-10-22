"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points as PointsType } from "three";

export function StarsField({ count = 5000 }: { count?: number }) {
  const pointsRef = useRef<PointsType>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = 50 + Math.random() * 100;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();
      arr[i3] = r * Math.sin(theta) * Math.cos(phi);
      arr[i3 + 1] = r * Math.cos(theta);
      arr[i3 + 2] = r * Math.sin(theta) * Math.sin(phi);
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.005;
      pointsRef.current.rotation.x = Math.sin(t * 0.05) * 0.03;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
      <PointMaterial transparent color="#aafaff" size={0.03} sizeAttenuation depthWrite={false} />
    </Points>
  );
}
