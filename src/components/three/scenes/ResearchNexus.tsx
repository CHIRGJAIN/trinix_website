"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Connection({ a, b, color = "#4cc9f0" }: { a: THREE.Vector3; b: THREE.Vector3; color?: string }) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setFromPoints([a, b]);
    return g;
  }, [a, b]);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 }), [color]);
  const line = useMemo(() => new THREE.Line(geom, mat), [geom, mat]);
  return <primitive object={line} />;
}

export function ResearchNexus() {
  const group = useRef<THREE.Group>(null!);
  const nodes = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 120; i++) {
      const r = 4 + Math.random() * 3.5;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      pts.push(new THREE.Vector3(r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p)));
    }
    return pts;
  }, []);

  const connections = useMemo(() => {
    const lines: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 2.8 && Math.random() > 0.6) {
          lines.push([nodes[i], nodes[j]]);
        }
      }
    }
    return lines;
  }, [nodes]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) group.current.rotation.y = t * 0.08;
  });

  return (
    <group ref={group}>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial emissive="#a26bff" emissiveIntensity={1.5} color="#0a0a0a" />
        </mesh>
      ))}
      {connections.map(([a, b], i) => (
        <Connection key={`l-${i}`} a={a} b={b} />
      ))}
    </group>
  );
}

