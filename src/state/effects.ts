import { create } from "zustand";
import * as THREE from "three";

type EffectsState = {
  sun: THREE.Object3D | null;
  setSun: (o: THREE.Object3D | null) => void;
  exposure: number; // -1..1 ~ brightness
  contrast: number; // 0..1
  bloom: number; // 0.5..1.6 multiplier
  setFX: (fx: Partial<Pick<EffectsState, "exposure" | "contrast" | "bloom">>) => void;
};

export const useEffects = create<EffectsState>((set) => ({
  sun: null,
  setSun: (o) => set({ sun: o }),
  exposure: 0,
  contrast: 0,
  bloom: 1,
  setFX: (fx) => set(fx),
}));

