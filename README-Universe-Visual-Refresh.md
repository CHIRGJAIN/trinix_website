Universe Visual Refresh
=======================

Feature flag
------------

- Env var: `NEXT_PUBLIC_UNIVERSE_VISUALS` = `legacy` | `enhanced` (default `enhanced`)
- Query override: `?visuals=legacy` or `?visuals=enhanced`

Scope
-----

- Visual-only changes for the Universe page (`/universe`).
- No logic, camera math, or scroll behavior changes.

What’s included
---------------

- Environment Lightformers (neon highlights)
- Nebula shader backdrop
- Planet atmosphere rim + cloud layer
- Glow trails
- PostFX chain (Bloom, Contrast, Noise, Vignette, DoF, GodRays)

Files
-----

- Components
  - `src/components/universe/VisualsFlag.ts`
  - `src/components/universe/VisualEnvironment.tsx`
  - `src/components/universe/Nebula.tsx`
  - `src/3d/postfx/UniverseFX.tsx`
- Tokens
  - `src/theme/tokens.ts`
- Source visual spec export (for parity)
  - `trinix-3d-main/VISUAL_SPEC_EXPORT.json`

Usage
-----

- Start dev: `npm run dev` and open `/universe`.
- Toggle visuals: add `?visuals=legacy` to URL to disable enhancements.

