import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/server/auth/simpleSession";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell session={session}>{children}</AdminShell>;
}
