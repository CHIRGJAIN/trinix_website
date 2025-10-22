import { redirect } from "next/navigation";

import { auth } from "./core";

export async function requireAuth(redirectTo = "/admin/login") {
  const session = await auth();
  if (!session) {
    redirect(redirectTo);
  }
  return session;
}

export function assertRole(session: Awaited<ReturnType<typeof requireAuth>>, allowed: string[] = ["admin"]) {
  const roles = session.roles ?? session.user?.roles ?? [];
  const permitted = roles.some((role: string) => allowed.includes(role));
  if (!permitted) {
    redirect("/admin/login?error=unauthorized");
  }
}
