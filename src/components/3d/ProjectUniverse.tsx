"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Trail } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { StarsField } from "@/components/3d/StarsField";
import { Sun } from "@/components/3d/Sun";
import { Planet } from "@/components/3d/Planet";
import { LogoSunBillboard } from "@/components/3d/LogoSunBillboard";
import { useVisualsMode } from "@/components/universe/VisualsFlag";
import { VisualEnvironment } from "@/components/universe/VisualEnvironment";
import { Nebula } from "@/components/universe/Nebula";
import { UniverseFX } from "@/3d/postfx/UniverseFX";
import projectsJson from "@/data/projects.json";
import type { Project } from "@/types/content";
import * as THREE from "three";
import { useScroll } from "framer-motion";

const VISIBLE_LABELS_MAX = 6;

type FocusState = { id: string; position: THREE.Vector3 } | null;

function getNameParts(name: string): { base: string; descriptor?: string } {
  const m = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (m) return { base: m[1].trim(), descriptor: m[2].trim() };
  return { base: name };
}

function CameraRig({ focus, activeIndex, radii, stage, segments, largestRadius }: { focus: FocusState; activeIndex: number; radii: number[]; stage: number; segments: number; largestRadius: number }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  const tmp = useRef(new THREE.Vector3());
  const baseFov = useRef<number | null>(null);

  useFrame(() => {
    const pc = camera instanceof THREE.PerspectiveCamera ? camera : null;
    if (pc && baseFov.current == null) baseFov.current = pc.fov;
    let baseZ: number;
    let baseY = 1.5;
    if (stage <= 0) {
      baseZ = largestRadius + 30;
      baseY = 6;
    } else if (stage >= segments - 1) {
      baseZ = 10;
      baseY = 0.5;
    } else {
      const r = radii[Math.max(0, Math.min(radii.length - 1, activeIndex))] ?? 20;
      baseZ = r + 8;
    }

    if (focus) {
      target.current.lerp(focus.position, 0.08);
      tmp.current.set(target.current.x + 4, target.current.y + 2, target.current.z + 6);
      camera.position.lerp(tmp.current, 0.08);
      camera.lookAt(target.current);
    } else {
      tmp.current.set(0, baseY, baseZ);
      camera.position.lerp(tmp.current, 0.1);
      camera.lookAt(0, 0, 0);
    }

    // Bounds test: micro-adjust FOV within ±3% to keep system in-frame
    const dist = Math.abs(camera.position.z);
    if (pc && !focus && dist > 0 && baseFov.current != null) {
      const pad = largestRadius * 1.15; // 15% breathing room
      const desired = THREE.MathUtils.radToDeg(2 * Math.atan(pad / dist));
      const minFov = baseFov.current * 0.97;
      const maxFov = baseFov.current * 1.03;
      const clamped = THREE.MathUtils.clamp(desired, minFov, maxFov);
      if (Math.abs(clamped - pc.fov) > 0.01) {
        pc.fov = clamped;
        pc.updateProjectionMatrix();
      }
    }
  });

  return null;
}

export function ProjectUniverse({ renderBelowDetails = true }: { renderBelowDetails?: boolean }) {
  const projects = projectsJson as Project[];
  const [focus, setFocus] = useState<FocusState>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const visuals = useVisualsMode();
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const [allowRender, setAllowRender] = useState(false);

  // Guard: ensure exactly one Canvas mount
  useEffect(() => {
    if (typeof document === "undefined") return;
    const existing = document.getElementById("projects-universe-canvas");
    if (existing) {
      console.warn("[ProjectsUniverse] Canvas already mounted; skipping duplicate.");
      setAllowRender(false);
      return;
    }
    setAllowRender(true);
  }, []);

  const scheme = useMemo(() => {
    const byId: Record<string, { color: string; cloudTint?: string; atmTint?: string; multiTint?: string[] }> = {
      sos: { color: "#FF9933", cloudTint: "#FFD08A" },
      "vedic-ai": { color: "#D2B48C", cloudTint: "#EAD7BB" },
      medgo: { color: "#34D399", cloudTint: "#6EE7B7" },
      eventify: { color: "#8B5CF6", cloudTint: "#A78BFA" },
      propgo: { color: "#2563EB", cloudTint: "#B87333" },
      "fin-fine": { color: "#0B0F10", cloudTint: "#22C55E", atmTint: "#16A34A" },
      dharamraksha: { color: "#0B0B0B", cloudTint: "#E5E7EB", atmTint: "#9CA3AF" },
      quirky: { color: "#F59E0B", cloudTint: "#FDE68A" },
      "ethereal-nexus": {
        color: "#7C6BFF",
        multiTint: ["#38D0FF", "#7C6BFF", "#5FFFE0", "#F59E0B", "#E879F9"],
      },
      webstitch: { color: "#3B82F6", cloudTint: "#10B981" },
    };
    return byId;
  }, []);

  type PlanetSpec = {
    id: string;
    name: string;
    radius: number;
    color: string;
    trailColor: THREE.Color;
    cloudTint?: string;
    atmTint?: string;
    multiTint?: string[];
    height: number;
    size: number;
    speed: number;
  };

  const planets: PlanetSpec[] = useMemo(() => {
    const ySpread = 1.6;
    const baseY = -((projects.length - 1) * ySpread) / 2;
    return projects.map((p, i) => {
      const s = scheme[p.id] ?? { color: "#6ecbff" };
      const { base } = getNameParts(p.name);
      return {
        id: p.id,
        name: base,
        radius: 40.5 + i * 6.2,
        color: s.color,
        trailColor: new THREE.Color(s.color),
        cloudTint: s.cloudTint,
        atmTint: s.atmTint,
        multiTint: s.multiTint,
        height: baseY + i * ySpread,
        size: (2.3125 + Math.min(1.525, i * 0.07875)) * 1.2 + 1,
        speed: 0.6 + i * 0.05,
      } as PlanetSpec;
    });
  }, [projects, scheme]);

  const radii = planets.map((p) => p.radius);
  const largestRadius = Math.max(...radii, 30);
  const segments = planets.length + 2;

  const { scrollYProgress } = useScroll();
  const scrollRef = useRef(0);
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      scrollRef.current = v;
      const segs = Math.max(1, planets.length + 2);
      const s = Math.max(0, Math.min(segs - 1, Math.floor(v * segs)));
      setStage(s);
      if (s <= 0) {
        setActiveIndex(Math.max(0, planets.length - 1));
      } else if (s >= segs - 1) {
        setActiveIndex(0);
      } else {
        const idx = planets.length - s;
        setActiveIndex(Math.max(0, Math.min(planets.length - 1, idx)));
      }
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [scrollYProgress, planets.length]);

  // Scroll lock guard: warn if nested scroll containers exist
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const sticky = document.querySelector('#projects-universe, [data-universe-sticky]') as HTMLElement | null;
    if (!sticky) return;
    let node: HTMLElement | null = sticky.parentElement;
    while (node) {
      const style = getComputedStyle(node);
      const overflowY = style.overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') {
        console.warn('[ProjectsUniverse] Nested scroll container detected. Bind scroll to root only.');
        break;
      }
      node = node.parentElement;
    }
  }, []);

  return (
    <div className="relative" style={{ height: `120vh` }}>
      <div className="sticky top-0 min-h-[92vh] h-screen w-screen overflow-hidden" data-universe-sticky>
        {allowRender && (
          <Canvas
            id="projects-universe-canvas"
            camera={{ position: [0, 2, 40], fov: isMobile ? 55 : 40, near: 0.1, far: 1000 }}
            dpr={isMobile ? [1, 1] : [1, 1.5]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
          >
          {visuals === "enhanced" ? <Nebula /> : null}
          <color attach="background" args={["#00010a"]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[6, 6, 6]} intensity={0.35} />
          <pointLight position={[0, 0, 0]} color="#f0b35a" intensity={1.8} distance={260} decay={2} />
          {visuals === "enhanced" ? <VisualEnvironment /> : null}
          <StarsField count={isMobile ? 1800 : 5000} />
          <Sun />
          {planets.map((pl, i) => {
            const isEmphasized = i === activeIndex || (!!focus && focus.id === pl.id) || hoveredId === pl.id;
            return (
              <Trail
                key={`trail-${pl.id}`}
                width={isMobile ? (isEmphasized ? 0.16 : 0.08) : (isEmphasized ? 0.22 : 0.12)}
                color={pl.trailColor}
                attenuation={(t) => Math.pow(1 - t, 2)}
                length={isEmphasized ? (isMobile ? 14 : 18) : (isMobile ? 8 : 12)}
                decay={0.6}
                local
              >
                <Planet
                  id={pl.id}
                  name={pl.name}
                  index={i}
                  orbitRadius={pl.radius}
                  orbitHeight={pl.height}
                  color={pl.color}
                  cloudTint={pl.cloudTint}
                  atmTint={pl.atmTint}
                  multiTint={pl.multiTint}
                  hideLabel={!!focus || i >= VISIBLE_LABELS_MAX}
                  size={pl.size}
                  speed={pl.speed}
                  active={i === activeIndex}
                  focused={!!focus && focus.id === pl.id}
                  onClick={(id, position) => setFocus({ id, position })}
                  onHoverChange={(id, h) => setHoveredId(h ? id : (hoveredId === id ? null : hoveredId))}
                />
              </Trail>
            );
          })}
          <Suspense fallback={null}>
            <LogoSunBillboard visible={!focus && stage >= segments - 1} strong />
          </Suspense>
          <CameraRig
            focus={focus}
            activeIndex={activeIndex}
            radii={radii}
            stage={stage}
            segments={segments}
            largestRadius={largestRadius}
          />
          <OrbitControls enablePan={false} enableZoom={false} enableRotate={!focus} />
          {visuals === "enhanced" ? <UniverseFX /> : null}
        </Canvas>
        )}

        <div className="pointer-events-none absolute inset-0 z-50 p-6">
          {!renderBelowDetails && (
            <div className="pointer-events-auto absolute left-6 right-6 top-6 mx-auto max-w-4xl">
              <h2 className="font-display text-3xl sm:text-4xl font-semibold">Our Projects</h2>
              <p className="mt-2 text-sm sm:text-base text-white/80">
                Showcasing our latest innovations and successful implementations across various industries. Each project represents our
                commitment to delivering exceptional digital solutions.
              </p>
            </div>
          )}

          {renderBelowDetails && !focus && stage >= segments - 1 && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-aurora-teal/80">Arrival</p>
              <h2 className="font-display text-3xl font-semibold text-white">Empowering Innovation. Building the Future.</h2>
              <div className="pointer-events-auto mt-2 flex items-center justify-center gap-4">
                <a href="/projects" className="rounded-full border border-aurora-teal/60 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white hover:border-white">Explore Our Projects</a>
                <a href="/careers" className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:text-white">Join the Vision</a>
              </div>
            </div>
          )}

          {focus && (
            <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-lg" onClick={() => setFocus(null)}>
              <div className="w-[92vw] max-w-2xl rounded-3xl border border-white/15 bg-white/10 p-6 text-white shadow-aurora backdrop-blur-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-aurora-teal/70">Project</p>
                    {(() => {
                      const project = projects.find((pp) => pp.id === focus.id);
                      if (!project) return null;
                      const parts = getNameParts(project.name);
                      const statusLabel =
                        typeof project.status === "string" ? project.status.toUpperCase() : undefined;
                      const domainLabel = project.domain ?? undefined;
                      const featureList = project.keyFeatures ?? [];
                      const ctas =
                        project.ctas && project.ctas.length > 0
                          ? project.ctas
                          : project.link
                          ? [{ label: "Explore", href: project.link }]
                          : [];
                      return (
                        <>
                          <h3 className="mt-2 font-display text-2xl font-semibold">{parts.base}</h3>
                          {parts.descriptor ? (
                            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/60">{parts.descriptor}</p>
                          ) : null}
                          {(statusLabel || domainLabel) && (
                            <div className="mt-3 flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-white/60">
                              {statusLabel ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white/80">
                                  {statusLabel}
                                </span>
                              ) : null}
                              {domainLabel ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/60">
                                  {domainLabel}
                                </span>
                              ) : null}
                            </div>
                          )}
                          <p className="mt-3 text-sm text-white/70">{project.summary}</p>
                          {featureList.length > 0 ? (
                            <ul className="mt-4 list-disc pl-5 space-y-1 text-sm text-white/80">
                              {featureList.map((feature, index) => (
                                <li key={`${project.id}-focus-feature-${index}`}>{feature}</li>
                              ))}
                            </ul>
                          ) : null}
                          {ctas.length > 0 ? (
                            <div className="mt-5 flex flex-wrap gap-3">
                              {ctas.map((cta, index) => (
                                <a
                                  key={`${project.id}-focus-cta-${index}`}
                                  href={cta.href}
                                  className={
                                    index === 0
                                      ? "rounded-md border border-aurora-teal/40 px-3 py-1 text-sm text-white hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
                                      : "rounded-md border border-white/20 px-3 py-1 text-sm text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-teal/60"
                                  }
                                >
                                  {cta.label}
                                </a>
                              ))}
                            </div>
                          ) : null}
                        </>
                      );
                    })()}
                  </div>
                  <button className="rounded-md border border-white/20 px-3 py-1 text-sm text-white/80 hover:text-white" onClick={() => setFocus(null)}>Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

