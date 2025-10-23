import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE } from "@/constants/adminSession";

export type SimpleAdminSession = {
  userId: string;
  email: string;
  name: string;
};

export async function getAdminSession(): Promise<SimpleAdminSession | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_SESSION_COOKIE);
  if (!cookie || cookie.value !== ADMIN_SESSION_VALUE) {
    return null;
  }

  return {
    userId: "admin",
    email: "admin@trinix.dev",
    name: "Trinix Admin",
  };
}
