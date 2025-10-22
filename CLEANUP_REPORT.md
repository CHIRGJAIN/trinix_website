# Clean-Up Report — 2025-10-20

## Scope
- Repository: `trinix-web`
- Branch: `chore/cleanup`
- Goal: remove unreferenced components/theme files without impacting routes, data contracts, or analytics.

## Detection Steps
- Ran `npx knip` to surface unused files/exports and treated findings as hints only.
- Verified each candidate with repo-wide text searches (`ContactForm`, `ResearchCard`, `TeamCard`, `theme/tokens`, `ProjectsUniverse`).
- Cross-checked app routes and dynamic imports to ensure no references from entrypoints or barrel files.

## Quarantined Deletions
All files were moved to `.trash/2025-10-20/` via `git mv` for review.

| Type | Original Path | Quarantine Path | Size (KB) | Rationale |
| --- | --- | --- | ---: | --- |
| Component | `src/components/ContactForm.tsx` | `.trash/2025-10-20/ContactForm.tsx` | 2.8 | Legacy form component replaced by inline implementation; no imports remain. |
| Component | `src/components/ResearchCard.tsx` | `.trash/2025-10-20/ResearchCard.tsx` | 1.2 | Never imported by research listing; redundant after refactors. |
| Component | `src/components/TeamCard.tsx` | `.trash/2025-10-20/TeamCard.tsx` | 0.6 | Superseded by current team section markup; orphaned. |
| Theme Tokens | `src/theme/tokens.ts` | `.trash/2025-10-20/theme-tokens.ts` | 0.2 | Documentation-only reference; no runtime usage. |
| 3D Scene | `src/components/three/scenes/ProjectsUniverse.tsx` | `.trash/2025-10-20/ProjectsUniverse.tsx` | 21.4 | Legacy scene router target; unused after R3F consolidation (no imports in active router). |

**Total size reclaimed (quarantined):** ≈ 26.2 KB

## Validation
- `npm run lint`
- `npm run build`

No build or lint regressions detected.

## Next Steps
- Review quarantined files; delete permanently in a follow-up commit if no objections.
- Optionally re-run analysis (knip/depcheck) after further refactors to keep tree clean.
