"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Mesh, Group, Vector3 } from "three";

type PlanetProps = {
  id: string;
  name: string;
  index: number;
  orbitRadius: number; // world units
  orbitHeight?: number; // per-planet orbit Y offset
  color: string;
  cloudTint?: string;
  atmTint?: string;
  multiTint?: string[];
  size?: number; // radius
  speed?: number; // multiplier
  onClick?: (id: string, position: Vector3) => void;
  onHoverChange?: (id: string, hovered: boolean) => void;
  active?: boolean;
  focused?: boolean;
  // When true, suppress rendering of the floating HTML label
  hideLabel?: boolean;
};

export function Planet({ id, name, index, orbitRadius, orbitHeight = 0, color, cloudTint, atmTint, multiTint, size = 0.7, speed = 1, onClick, onHoverChange, active = false, focused = false, hideLabel = false }: PlanetProps) {
  const groupRef = useRef<Group>(null!);
  const meshRef = useRef<Mesh>(null!);
  const labelRef = useRef<Group>(null!);
  const atmosRef = useRef<THREE.ShaderMaterial>(null!);
  const cloudsRef = useRef<THREE.ShaderMaterial>(null!);
  const [hovered, setHovered] = useState(false);

  const baseGeometry = useMemo(() => new THREE.SphereGeometry(1, 48, 48), []);
  useEffect(() => () => baseGeometry.dispose(), [baseGeometry]);

  const planetMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 0.3,
      roughness: 0.55,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.1,
      envMapIntensity: 1,
    });
  }, [color]);
  useEffect(() => () => planetMaterial.dispose(), [planetMaterial]);

  type CloudsUniforms = { uTime: { value: number }; uTint: { value: THREE.Color } };
  type AtmosUniforms = { uColor: { value: THREE.Color } };

  const initialPhase = useMemo(() => (index / 8) * Math.PI * 2, [index]);
  const angleRef = useRef<number>(initialPhase);

  useFrame(({ clock }, delta) => {
    // Freeze orbital motion when hovered for easier clicking
    const speedMul = hovered ? 0 : 1;
    const base = 0.2 * speed;
    angleRef.current += delta * base * speedMul;
    const angle = angleRef.current;
    const x = orbitRadius * Math.cos(angle);
    const z = orbitRadius * 0.7 * Math.sin(angle);
    if (groupRef.current) {
      groupRef.current.position.set(x, orbitHeight, z);
      groupRef.current.rotation.y = angle;
    }
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.rotation.y = t * 0.6;
      meshRef.current.rotation.x = 0.08 * Math.sin(t * 0.45);
      const breathe = 1 + 0.015 * Math.sin(t * 0.8 + index);
      let scaleMul = breathe;
      if (hovered) {
        const hoverFactor = size > 0 ? (size + 1) / size : 1;
        scaleMul *= hoverFactor;
      } else if (active || focused) {
        scaleMul *= 1.06;
      }
      meshRef.current.scale.setScalar(scaleMul * size);
    }

    const mat = planetMaterial;
    if (mat) {
      const t = clock.getElapsedTime();
      const baseEmissive = 0.12;
      const pulse = 0.08 * (0.5 + 0.5 * Math.sin(t * 1.2 + index));
      const extra = hovered ? 0.2 : active || focused ? 0.12 : 0;
      mat.emissiveIntensity = baseEmissive + pulse + extra;
    }
    // animate cloud layer
    if (cloudsRef.current) {
      const t = clock.getElapsedTime();
      (cloudsRef.current.uniforms as CloudsUniforms).uTime.value = t;
      if (multiTint && multiTint.length > 1) {
        const speed = 0.15;
        const seg = (t * speed) % multiTint.length;
        const i0 = Math.floor(seg);
        const i1 = (i0 + 1) % multiTint.length;
        const f = seg - i0;
        const c0 = new THREE.Color(multiTint[i0]);
        const c1 = new THREE.Color(multiTint[i1]);
        const r = THREE.MathUtils.lerp(c0.r, c1.r, f);
        const g = THREE.MathUtils.lerp(c0.g, c1.g, f);
        const b = THREE.MathUtils.lerp(c0.b, c1.b, f);
        (cloudsRef.current.uniforms as CloudsUniforms).uTint.value.setRGB(r, g, b);
        (atmosRef.current.uniforms as AtmosUniforms).uColor.value.setRGB(r, g, b);
      }
    }
    // Label stays centered on the globe (no orbital motion) and scales with planet size
    if (labelRef.current) {
      const scale = THREE.MathUtils.clamp(0.6 + size * 0.6, 0.9, 3.2);
      labelRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHoverChange?.(id, true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onHoverChange?.(id, false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick && groupRef.current) onClick(id, groupRef.current.position.clone());
        }}
        geometry={baseGeometry}
        material={planetMaterial}
        scale={size}
      />

      {/* Visual-only atmosphere rim and subtle cloud layer (do not affect logic) */}
      <mesh scale={1.08 * size} raycast={() => null}>
        <primitive object={baseGeometry} attach="geometry" />
        <shaderMaterial
          ref={atmosRef}
          transparent
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          uniforms={{ uColor: { value: new THREE.Color(atmTint ?? color) } }}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vViewDir;
            void main(){
              vec4 mvPosition = modelViewMatrix * vec4(position,1.0);
              vNormal = normalize(normalMatrix * normal);
              vViewDir = normalize(-mvPosition.xyz);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            varying vec3 vViewDir;
            uniform vec3 uColor;
            void main(){
              float ndv = max(0.0, dot(normalize(vNormal), normalize(vViewDir)));
              float rim = pow(1.0 - ndv, 2.0);
              vec3 col = uColor * 1.4 * rim;
              gl_FragColor = vec4(col, rim * 0.5);
            }
          `}
        />
      </mesh>
      <mesh scale={1.03 * size} raycast={() => null}>
        <primitive object={baseGeometry} attach="geometry" />
        <shaderMaterial
          ref={cloudsRef}
          transparent
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          uniforms={{ uTime: { value: 0 }, uTint: { value: new THREE.Color(cloudTint ?? color) } }}
          vertexShader={`
            varying vec3 vPos;
            void main(){
              vPos = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vPos;
            uniform float uTime;
            uniform vec3 uTint;
            float hash(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }
            float noise(vec3 p){
              vec3 i = floor(p); vec3 f = fract(p);
              float n = mix(mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
                                mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
                              mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                                  mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
              return n;
            }
            void main(){
              vec3 p = normalize(vPos) * 2.0;
              float n = noise(p * 2.5 + vec3(uTime*0.03, 0.0, -uTime*0.02));
              float clouds = smoothstep(0.52, 0.78, n);
              vec3 col = mix(vec3(0.0), uTint * 1.2, clouds);
              gl_FragColor = vec4(col, clouds * 0.35);
            }
          `}
        />
      </mesh>

      {/* Planet name label (original style) */}
      {!hideLabel && (
        <group ref={labelRef} position={[0, 0, 0]} raycast={() => null}>
          <Html center transform style={{ pointerEvents: "none" }}>
            <div className="pointer-events-none select-none px-3.5 py-2 text-lg md:text-2xl font-bold text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.8)]">
              {name}
            </div>
          </Html>
        </group>
      )}

      {/** Removed halo overlay to prevent any glass/overlay effect over the globe */}

      {/* Removed near-planet focused card (kept horizontal bar in ProjectUniverse) */}
    </group>
  );
}
