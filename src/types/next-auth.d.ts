import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    roles: string[];
    user: DefaultSession["user"] & {
      id?: string;
      roles: string[];
    };
  }

  interface User {
    roles: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    roles?: string[];
  }
}
