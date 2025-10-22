"use client";

import { Billboard } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export function LogoSunBillboard({ visible, strong = false }: { visible: boolean; strong?: boolean }) {
  const tex = useLoader(THREE.TextureLoader, "/trinix-logo.png");
  tex.colorSpace = THREE.SRGBColorSpace;
  if (!visible) return null;

  return (
    <Billboard>
      <mesh position={[0, 0, 0.02]} raycast={() => null}>
        <planeGeometry args={[3.2, 3.2]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} opacity={strong ? 1 : 0.9} />
      </mesh>
      <mesh raycast={() => null}>
        <planeGeometry args={[6.2, 6.2]} />
        <meshBasicMaterial
          color="#f0b35a"
          transparent
          opacity={strong ? 0.22 : 0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </Billboard>
  );
}
