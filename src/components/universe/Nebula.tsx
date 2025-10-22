"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Nebula() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });
  return (
    <mesh position={[0, 0, -80]}> 
      <planeGeometry args={[400, 280]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        depthTest={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          float lno(vec2 p) {
            return 0.5 + 0.5 * sin(p.x) * cos(p.y);
          }
          void main() {
            vec2 uv = vUv * 2.0 - 1.0;
            uv.x *= 1.6;
            float t = uTime * 0.05;
            vec2 w = uv;
            w += 0.25 * vec2(sin(uv.y*2.0 + t), cos(uv.x*2.0 - t));
            float n1 = lno(w*2.0 + t);
            float n2 = lno(w*3.5 - t*1.3);
            float neb = smoothstep(0.15, 0.95, n1*0.7 + n2*0.6);
            float vign = smoothstep(1.3, 0.15, length(uv));
            vec3 base = vec3(0.05,0.03,0.12);
            vec3 glow = mix(base, vec3(0.55,0.50,1.0), neb*0.8) + vec3(0.12,0.28,0.9)*neb*0.3;
            vec3 col = glow * vign;
            gl_FragColor = vec4(col, 0.6 * neb * vign);
          }
        `}
      />
    </mesh>
  );
}

