"use client";

import { useEffect, useMemo, useRef, useState, useCallback, forwardRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Trail, useTexture, Stars, Html, OrbitControls, Text, Line, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useEffects } from "@/state/effects";

type PlanetData = {
  title: string;
  subtitle: string;
  description: string;
  link: string;
};

type PlanetSpec = {
  name: string;
  orbit: number; // base units
  size: number; // radius units
  color: string;
  data: PlanetData;
};

const PLANETS: PlanetSpec[] = [
  {
    name: "Eventify",
    orbit: 8,
    size: 1.2,
    color: "#00b4ff",
    data: {
      title: "Eventify",
      subtitle: "Next-Gen Event & Offer Management",
      description: "A complete ecosystem for events and nightlife management with B2B2C integration.",
      link: "/eventify",
    },
  },
  {
    name: "PropGo",
    orbit: 12,
    size: 1.1,
    color: "#ff6b00",
    data: {
      title: "PropGo",
      subtitle: "Real Estate Simplified",
      description: "A property platform enabling verified dealer onboarding and transparent property listings.",
      link: "/propgo",
    },
  },
  {
    name: "MedGo",
    orbit: 16,
    size: 1.0,
    color: "#00ffaa",
    data: {
      title: "MedGo",
      subtitle: "Unified Healthcare Platform",
      description: "Patient-first healthcare records and prescription access system.",
      link: "/coming-soon",
    },
  },
  {
    name: "Vedic AI",
    orbit: 20,
    size: 1.0,
    color: "#ff00aa",
    data: {
      title: "Vedic AI",
      subtitle: "AI meets Ancient Wisdom",
      description: "A hybrid AI system for decoding ancient texts and philosophical models.",
      link: "/coming-soon",
    },
  },
  {
    name: "Rango",
    orbit: 24,
    size: 0.9,
    color: "#ffaa00",
    data: {
      title: "Rango",
      subtitle: "AI-Powered Recommendation Engine",
      description: "Predictive analytics for personalized suggestions across Trinix platforms.",
      link: "/coming-soon",
    },
  },
  {
    name: "DKGo",
    orbit: 28,
    size: 0.9,
    color: "#00aaff",
    data: {
      title: "DKGo",
      subtitle: "Decentralized Knowledge Graph",
      description: "Knowledge storage and retrieval platform integrating blockchain for transparency.",
      link: "/coming-soon",
    },
  },
  {
    name: "Fingo",
    orbit: 32,
    size: 0.9,
    color: "#aa00ff",
    data: {
      title: "Fingo",
      subtitle: "FinTech Reinvented",
      description: "A next-gen crypto reserve model merging finance, stability, and transparency.",
      link: "/coming-soon",
    },
  },
];

const SCALE = 0.45;

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function Sun({ progress = 0 }: { progress?: number }) {
  const sunRef = useRef<THREE.Mesh>(null!);
  const spriteRef = useRef<THREE.Sprite>(null!);
  const setSun = useEffects((s) => s.setSun);
  const texture = useTexture("/trinix-logo.png");
  const raysMat = useRef<THREE.ShaderMaterial>(null!);

  useEffect(() => {
    if (sunRef.current) setSun(sunRef.current);
    return () => setSun(null);
  }, [setSun]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = 1 + Math.sin(t * 2.0) * 0.04;
    const finale = easeInOutCubic(THREE.MathUtils.clamp((progress - 0.86) / 0.12, 0, 1));
    sunRef.current.scale.setScalar(s * (1 + finale * 0.6));
    if (spriteRef.current) spriteRef.current.material.opacity = 0.9 + Math.sin(t * 1.5) * 0.08;
    if (raysMat.current) {
      const uniforms = raysMat.current.uniforms as { uTime: { value: number } };
      uniforms.uTime.value = t;
    }
  });

  return (
    <group>
      <mesh ref={sunRef} position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshStandardMaterial
          color="#0b0e1a"
          emissive={new THREE.Color("#6aa8ff").multiplyScalar(0.8)}
          emissiveIntensity={2.6}
          metalness={0.05}
          roughness={0.35}
        />
      </mesh>

      <sprite ref={spriteRef} scale={[3.4, 3.4, 1]} position={[0, 0, 0.05]}>
        <spriteMaterial
          map={texture}
          transparent
          depthWrite={false}
          depthTest
          color={new THREE.Color("#a3b6ff")}
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <mesh scale={2.6}>
        <sphereGeometry args={[1.0, 48, 48]} />
        <meshBasicMaterial color="#7b6aff" transparent opacity={0.07} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <shaderMaterial
          ref={raysMat}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uTime: { value: 0 }, uColor: { value: new THREE.Color("#7c6bff") } }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv * 2.0 - 1.0;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec2 vUv;
            uniform float uTime;
            uniform vec3 uColor;
            void main() {
              float r = length(vUv);
              float a = atan(vUv.y, vUv.x);
              float rays = 0.0;
              for (int i=0; i<6; i++) {
                float ia = float(i) * 1.0472;
                float band = smoothstep(0.08, 0.0, abs(sin((a - ia) * 6.0 + uTime*0.8)));
                rays += band;
              }
              float falloff = smoothstep(1.0, 0.0, r);
              float glow = rays * falloff * 0.12;
              vec3 col = uColor * glow;
              gl_FragColor = vec4(col, glow);
            }
          `}
        />
      </mesh>

      <pointLight color="#6aa8ff" intensity={8} distance={40} decay={2} />
      <pointLight color="#a26bff" intensity={4.5} distance={30} decay={2} position={[0, 0.5, 0.2]} />
    </group>
  );
}

type OrbitShape = { a: number; b: number; tilt: number; rot: number };

function EllipsePath({ shape, color = "#1a2742", opacity = 0.24 }: { shape: OrbitShape; color?: string; opacity?: number }) {
  const pts = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    const steps = 256;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const x = shape.a * Math.cos(t);
      const y = shape.b * Math.sin(t);
      arr.push(new THREE.Vector3(x, y, 0));
    }
    return arr;
  }, [shape.a, shape.b]);

  return (
    <group rotation={[shape.tilt, shape.rot, 0]}>
      <Line points={pts} color={color} lineWidth={0.5} transparent opacity={opacity} dashed={false} />
    </group>
  );
}

type PlanetProps = {
  orbit: number;
  size: number;
  color: string;
  phase?: number;
  index: number;
  focused: boolean;
  hovered: boolean;
  onHover: (i: number) => void;
  onUnhover: (i: number) => void;
  onClick: (i: number) => void;
  data: PlanetData;
  hasRing?: boolean;
  shape: OrbitShape;
};

const Planet = forwardRef<THREE.Mesh, PlanetProps>(function Planet(
  { orbit, size, color, phase = 0, index, focused, hovered, onHover, onUnhover, onClick, data, hasRing, shape },
  forward
) {
  const ref = useRef<THREE.Mesh>(null!);
  const ringGlowRef = useRef<THREE.Object3D | null>(null);
  const atmosRef = useRef<THREE.ShaderMaterial>(null!);
  const cloudsRef = useRef<THREE.ShaderMaterial>(null!);
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);
  const angleRef = useRef<number>(phase);
  useEffect(() => {
    if (typeof forward === "function") forward(ref.current);
    else if (forward) (forward as React.MutableRefObject<THREE.Mesh | null>).current = ref.current;
  }, [forward]);

  const speed = useMemo(() => 0.18 / (1 + orbit * 0.04), [orbit]);
  const aSemi = shape.a;
  const bSemi = shape.b;

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const sp = hovered || focused ? 0 : speed;
    angleRef.current += delta * sp;
    const ang = angleRef.current;
    const x = Math.cos(ang) * aSemi;
    const z = Math.sin(ang) * bSemi;
    const y = Math.sin(ang * 1.7) * 0.25;
    ref.current.position.set(x, y, z);
    ref.current.rotation.y += 0.01 + (0.002 * (10 - size));
    if (ringGlowRef.current) {
      const anyObj = ringGlowRef.current as unknown as { material?: { opacity?: number }; lineMaterial?: { opacity?: number } };
      const mat = anyObj.material || anyObj.lineMaterial;
      if (mat && typeof mat.opacity === "number") {
        const current = mat.opacity;
        const target = hovered || focused ? 0.32 : 0.08;
        (mat as { opacity: number }).opacity = current + (target - current) * 0.08;
      }
    }
    if (matRef.current) {
      const base = (hovered || focused) ? 1.25 : 0.7;
      const pulse = (hovered || focused) ? 0.25 * (0.5 + 0.5 * Math.sin(t * 3.0 + index)) : 0;
      matRef.current.emissiveIntensity = base + pulse;
    }
    if (atmosRef.current) {
      (atmosRef.current.uniforms as { uTime: { value: number } }).uTime.value = t;
    }
    if (cloudsRef.current) {
      (cloudsRef.current.uniforms as { uTime: { value: number } }).uTime.value = t;
    }
  });

  return (
    <group rotation={[shape.tilt, shape.rot, 0]}>
      <Trail
        width={0.04}
        color={new THREE.Color(color)}
        attenuation={(t) => Math.pow(1 - t, 2)}
        length={6}
        decay={0.6}
        local
      >
        <mesh
          ref={ref}
          castShadow
          receiveShadow
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(index);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onUnhover(index);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick(index);
          }}
        >
          <sphereGeometry args={[size * 0.35, 96, 96]} />
          <meshStandardMaterial
            ref={matRef}
            color={new THREE.Color("#0b0b0f")}
            emissive={new THREE.Color(color)}
            emissiveIntensity={hovered || focused ? 1.25 : 0.7}
            metalness={0.2}
            roughness={0.4}
            envMapIntensity={0.55}
          />

          <mesh scale={1.06}>
            <sphereGeometry args={[size * 0.35, 64, 64]} />
            <shaderMaterial
              ref={atmosRef}
              transparent
              depthWrite={false}
              uniforms={{ uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } }}
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
                uniform vec3 uColor;
                void main(){
                  float r = length(vPos);
                  float rim = smoothstep(0.32, 0.05, 1.0 - r);
                  vec3 col = uColor * 0.8 * rim;
                  gl_FragColor = vec4(col, rim * 0.18);
                }
              `}
            />
          </mesh>

          <mesh scale={1.02}>
            <sphereGeometry args={[size * 0.35, 64, 64]} />
            <shaderMaterial
              ref={cloudsRef}
              transparent
              depthWrite={false}
              uniforms={{ uTime: { value: 0 }, uTint: { value: new THREE.Color(color) } }}
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
                  vec3 p = normalize(vPos) * 1.5;
                  float n = noise(p * 2.5 + vec3(uTime*0.03, 0.0, -uTime*0.02));
                  float clouds = smoothstep(0.58, 0.72, n);
                  vec3 col = mix(vec3(0.0), uTint * 0.8, clouds);
                  gl_FragColor = vec4(col, clouds * 0.18);
                }
              `}
            />
          </mesh>

          <Text
            position={[0, size * 0.8 + 0.2, 0]}
            fontSize={0.28}
            color={color}
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.01}
            outlineColor="#09111f"
            renderOrder={2}
            depthOffset={-1}
          >
            {data.title}
          </Text>

          {/* Floating info card when focused */}
          {focused ? (
            <Html center transform sprite distanceFactor={8} position={[0, size * 0.8 + 0.6, 0]}>
              <div className="glass rounded-xl border border-white/15 p-3 shadow-xl text-left min-w-56 max-w-64">
                <div className="text-sm font-semibold" style={{ color }}>{data.title}</div>
                <div className="text-xs text-white/70">{data.subtitle}</div>
                <div className="text-xs text-white/60 mt-2">{data.description}</div>
                <div className="mt-3 flex items-center gap-2">
                  <a href={data.link} className="text-xs px-3 py-1 rounded-md border hover:bg-white/5" style={{ borderColor: color }}>
                    Explore →
                  </a>
                  <button onClick={(e) => { e.stopPropagation(); onClick(index); }} className="text-xs px-2 py-1 rounded-md border border-white/15 text-white/70 hover:text-white">
                    Close
                  </button>
                </div>
              </div>
            </Html>
          ) : null}
        </mesh>
      </Trail>

      <Line
        // @ts-expect-error drei Line ref typing
        ref={ringGlowRef}
        points={Array.from({ length: 256 }, (_, i) => {
          const t = (i / 256) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(t) * aSemi, 0, Math.sin(t) * bSemi);
        })}
        color={color}
        lineWidth={0.6}
        transparent
        opacity={0.1}
      />

      {hasRing ? (
        <group>
          <mesh rotation-x={-Math.PI / 2.2} rotation-z={0.3} position={ref.current ? ref.current.position : undefined}>
            <ringGeometry args={[size * 0.5, size * 0.9, 128]} />
            <meshStandardMaterial color={color} emissive={new THREE.Color(color)} emissiveIntensity={0.6} transparent opacity={0.35} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
});

export function ProjectsUniverse() {
  return <ProjectsUniverseContent />;
}

function ProjectsUniverseContent() {
  const group = useRef<THREE.Group>(null!);
  const { camera } = useThree();
  const isMobile = typeof window !== "undefined" ? window.innerWidth <= 768 : false;

  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const planetRefs = useRef<THREE.Mesh[]>([]);
  const setPlanetRef = useCallback((i: number) => (m: THREE.Mesh | null) => {
    if (m) planetRefs.current[i] = m;
  }, []);


  const shapes = useMemo(() =>
    PLANETS.map((p, i) => {
      const a = Math.max(0.1, (p.orbit - 5) * SCALE);
      const b = a * (0.78 + 0.04 * (i % 4));
      const tilt = (Math.PI / 180) * (4 + (i % 5) * 1.5);
      const rot = 0.25 * (i % 7);
      return { a, b, tilt, rot } as OrbitShape;
    }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Smooth idle camera motion (no scroll): orbit around center
    const radius = 14;
    const x = Math.cos(t * 0.1) * radius;
    const z = Math.sin(t * 0.1) * radius;
    const y = 3 + Math.sin(t * 0.23) * 0.6;
    camera.position.lerp(new THREE.Vector3(x, y, z), 0.06);
    camera.lookAt(0, 0, 0);

    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const pcam = camera as THREE.PerspectiveCamera;
      const baseFov = isMobile ? 58 : 54;
      pcam.fov = THREE.MathUtils.lerp(pcam.fov, baseFov, 0.05);
      pcam.updateProjectionMatrix();
    }

    if (group.current) group.current.rotation.y = t * 0.01;
  });

  const electricBlue = "#6aa8ff";
  const irisViolet = "#a26bff";

  return (
    <group ref={group}>
      <Stars radius={60} depth={40} count={isMobile ? 1400 : 2600} factor={isMobile ? 2.2 : 2.6} saturation={0} fade speed={0.2} />
      <Dust count={isMobile ? 600 : 900} />
      <Nebula />
      <Sun />
      <ambientLight intensity={0.35} color={electricBlue} />
      <Environment resolution={256} background={false} frames={1}>
        <Lightformer intensity={0.8} color={electricBlue} form="ring" scale={[40, 40, 1]} position={[0, 0, -30]} />
        <Lightformer intensity={0.6} color={irisViolet} form="circle" scale={8} position={[20, 5, 20]} />
        <Lightformer intensity={0.4} color="#6bd4ff" form="circle" scale={6} position={[-18, -4, 14]} />
      </Environment>

      {PLANETS.map((p, i) => (
        <EllipsePath key={`ring-${p.name}`} shape={shapes[i]} color="#152238" opacity={0.28} />
      ))}

      {PLANETS.map((p, i) => (
        <Planet
          key={`planet-${p.name}`}
          orbit={p.orbit}
          size={p.size}
          color={p.color}
          phase={i * 0.7}
          index={i}
          focused={selected === i}
          hovered={hovered === i}
          onHover={setHovered}
          onUnhover={() => setHovered(null)}
          onClick={(idx) => setSelected((s) => (s === idx ? null : idx))}
          data={p.data}
          hasRing={p.name === "Rango"}
          shape={shapes[i]}
          ref={setPlanetRef(i)}
        />
      ))}

      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.6} enableDamping dampingFactor={0.08} />
      <hemisphereLight color={electricBlue} groundColor={irisViolet} intensity={0.15} />

      {/** Removed center tagline per request */}
    </group>
  );
}

function Dust({ count = 900, radius = 16, speed = 0.04 }: { count?: number; radius?: number; speed?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * Math.random();
      const a = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * radius * 0.4;
      arr[i * 3 + 0] = Math.cos(a) * r;
      arr[i * 3 + 1] = h;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [count, radius]);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);
  const mat = useMemo(() => new THREE.PointsMaterial({ color: "#9fb6ff", size: 0.02, sizeAttenuation: true, transparent: true, opacity: 0.6 }), []);
  useFrame(() => {
    const pos = (ref.current.geometry as THREE.BufferGeometry).attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const len = Math.sqrt(x * x + z * z) + 1e-5;
      const nx = (x / len) * speed;
      const nz = (z / len) * speed;
      let nxp = x + nx;
      let nzp = z + nz;
      if (Math.sqrt(nxp * nxp + nzp * nzp) > radius) {
        const a = Math.random() * Math.PI * 2;
        const r = radius * 0.2;
        nxp = Math.cos(a) * r;
        nzp = Math.sin(a) * r;
      }
      pos.setX(i, nxp);
      pos.setZ(i, nzp);
    }
    pos.needsUpdate = true;
    ref.current.rotation.y += 0.0008;
  });
  return <points ref={ref} args={[geom, mat]} />;
}

function Nebula() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });
  return (
    <mesh position={[0, 0, -30]}>
      <planeGeometry args={[120, 80]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
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
            float neb = smoothstep(0.2, 0.9, n1*0.6 + n2*0.5);
            float vign = smoothstep(1.2, 0.2, length(uv));
            vec3 col = mix(vec3(0.03,0.02,0.06), vec3(0.45,0.40,1.0), neb*0.6) + vec3(0.1,0.25,0.8)*neb*0.2;
            col *= vign;
            gl_FragColor = vec4(col, 0.35 * neb * vign);
          }
        `}
      />
    </mesh>
  );
}
