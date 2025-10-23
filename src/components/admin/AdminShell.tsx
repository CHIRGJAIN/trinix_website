'use client';

import { type ReactNode, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SimpleAdminSession } from '@/server/auth/simpleSession';

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/careers', label: 'Careers' },
  { href: '/admin/research', label: 'Research' },
];

type AdminShellProps = {
  session: SimpleAdminSession | null;
  children: ReactNode;
};

export function AdminShell({ session, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      <DashboardChrome session={session}>{children}</DashboardChrome>
    </div>
  );
}

function DashboardChrome({ children, session }: { children: ReactNode; session: AdminShellProps['session'] }) {
  const pathname = usePathname();

  const nav = useMemo(
    () =>
      NAV_LINKS.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
        return { ...item, isActive };
      }),
    [pathname]
  );

  const handleSignOut = () => {
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/admin/login';
  };

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10 md:px-10">
      <aside className="hidden w-60 shrink-0 flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:flex">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-aurora-teal/70">Trinix Admin</p>
          <h1 className="font-display text-xl font-semibold text-white">Control Center</h1>
        </div>
        <nav className="mt-6 flex flex-col gap-1" aria-label="Admin Navigation">
          {nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                link.isActive
                  ? 'rounded-xl border border-aurora-teal/60 bg-aurora-teal/10 px-3 py-2 text-sm font-medium text-white'
                  : 'rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-white/70 transition hover:border-white/10 hover:text-white'
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex w-full flex-1 flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-aurora-teal/70">Secure session</p>
            <h2 className="font-display text-lg font-semibold text-white">Admin Console</h2>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/80">
            <div className="hidden flex-col text-right sm:flex">
              <span className="font-medium text-white">{session?.name ?? 'Administrator'}</span>
              <span className="text-xs uppercase tracking-[0.25em] text-white/60">{session?.email}</span>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:text-white"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="flex-1 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          {children}
        </main>
      </div>
    </div>
  );
}
