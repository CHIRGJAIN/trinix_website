import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/server/auth/core";

async function isLoginRoute() {
  const headerList = await headers();
  const nextUrl =
    headerList.get("next-url") ?? headerList.get("x-invoke-path") ?? headerList.get("next-invoke-path") ?? "";
  return nextUrl.startsWith("/admin/login");
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const loginRoute = await isLoginRoute();
  const session = await auth();

  if (!session) {
    if (loginRoute) {
      return children;
    }
    redirect("/admin/login");
  }

  if (loginRoute) {
    redirect("/admin");
  }

  return <AdminShell session={session}>{children}</AdminShell>;
}
