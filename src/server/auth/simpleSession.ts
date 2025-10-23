import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";
const SESSION_VALUE = "authenticated";

export type SimpleAdminSession = {
  userId: string;
  email: string;
  name: string;
};

export function getAdminSession(): SimpleAdminSession | null {
  const cookie = cookies().get(SESSION_COOKIE);
  if (!cookie || cookie.value !== SESSION_VALUE) {
    return null;
  }

  return {
    userId: "admin",
    email: "admin@trinix.dev",
    name: "Trinix Admin",
  };
}
