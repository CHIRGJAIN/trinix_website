## Trinix Web Platform

Trinix web is a Next.js 15 (App Router + Turbopack) application showcasing projects, research, and blog posts from the Trinix lab. The codebase now includes a secure admin area for managing content in upcoming phases.

## Quick Start

```bash
npm install
npm run dev
```

- App: http://localhost:3000
- Admin: http://localhost:3000/admin (requires credentials)

## Environment Variables

Create a `.env.local` file using the template below. Password hash must be Argon2id or bcrypt hash (use `bcryptjs` via `node -e "console.log(require('bcryptjs').hashSync('password', 10))"`).

```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=$2a$10$...
ADMIN_NAME=Trinix Admin
ADMIN_ROLES=admin,editor
ADMIN_USER_ID=admin
NEXTAUTH_SECRET=change-me
NEXTAUTH_URL=http://localhost:3000
```

## Scripts

- `npm run dev` – start development server with Turbopack
- `npm run lint` – lint + type-check via ESLint
- `npm run build` – production build (SSG/SSR)

## Admin CMS (Phase 1)

- `/admin/login` – credential-based login using NextAuth v5
- `/admin` – dashboard shell (protected)
- `/admin/blog`, `/admin/projects`, `/admin/research` – read-only listings sourced from existing JSON/TS data
- Role-aware session stored in JWT; helper utilities located in `src/server/auth`

### Next Steps (Planned Phases)

See `CLEANUP_REPORT.md` and project notes for the roadmap. Upcoming work covers editable forms, audit logging, media uploads, and workflow tooling.

## Project Structure Highlights

- `src/app` – App Router pages, including admin routes
- `src/components` – shared UI + admin shells/forms
- `src/server` – auth configuration, service stubs (expand here for future CRUD/audit logic)
- `public/data` + `src/data` – current JSON sources for projects/blog/research

## Deployment

The site targets Vercel. Ensure all environment variables (including `NEXTAUTH_SECRET`) are configured in the hosting environment.

## Support

Questions or contributions? Open an issue or reach out to the Trinix engineering team.
