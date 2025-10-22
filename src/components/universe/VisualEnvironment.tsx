"use client";

import { Environment, Lightformer } from "@react-three/drei";

export function VisualEnvironment() {
  return (
    <Environment resolution={256} background={false} frames={1}>
      <Lightformer intensity={1.4} color="#6aa8ff" form="ring" scale={[60, 60, 1]} position={[0, 0, -60]} />
      <Lightformer intensity={1.0} color="#a26bff" form="circle" scale={14} position={[24, 6, 26]} />
      <Lightformer intensity={0.8} color="#6bd4ff" form="circle" scale={10} position={[-22, -6, 18]} />
    </Environment>
  );
}

