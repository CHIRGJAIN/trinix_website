"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Image from "next/image";



const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  // Projects grid removed; Universe unified under /projects and labeled "Project"
  { href: "/projects", label: "Project" },
  { href: "/blog", label: "Blogs" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const activeHref = useMemo(() => {
    if (!pathname) {
      return "/";
    }
    const match = NAV_ITEMS.find((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)));
    return match?.href ?? "/";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-cosmic-black/50 shadow-lg shadow-black/30 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-white/80">
          <Image src="/trinix-logo.png" alt="Trinix" width={44} height={44} priority className="drop-shadow" />
          <span className="text-lg font-semibold uppercase tracking-[0.3em]">Trinix</span>
        </Link>
        <ul className="relative flex items-center gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-white/60 shadow-aurora">
          {NAV_ITEMS.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <li key={item.href} className="relative">
                <Link href={item.href} className={`relative z-10 transition ${isActive ? "text-white" : "hover:text-aurora-teal"}`}>
                  {item.label}
                </Link>
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-x-[-10px] bottom-[-6px] h-px bg-gradient-to-r from-aurora-teal via-white to-copper-gold"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
