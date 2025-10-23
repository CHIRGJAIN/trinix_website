import type { NextAuthConfig, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email("Enter a valid email"),
  password: z.string({ required_error: "Password is required" }).min(1, "Password is required"),
});

function resolveEnvUser() {
  const email = process.env.ADMIN_EMAIL ?? "admin@trinix.dev";
  const passwordHash = process.env.ADMIN_PASSWORD_HASH ?? "trinix-admin";
  const displayName = process.env.ADMIN_NAME ?? "Trinix Admin";
  const roles = (process.env.ADMIN_ROLES ?? "admin").split(",").map((role) => role.trim()).filter(Boolean);

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) {
    console.warn(
      "[Auth] Using default admin credentials. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH environment variables before production."
    );
  }

  return { id: process.env.ADMIN_USER_ID ?? "admin", email, passwordHash, name: displayName, roles } satisfies User & {
    passwordHash: string;
    roles: string[];
  };
}

async function verifyPassword(candidate: string, storedHash: string) {
  try {
    return await compare(candidate, storedHash);
  } catch {
    // Fallback for non-bcrypt hashes (e.g., plain text for local testing only)
    return candidate === storedHash;
  }
}

export const authOptions: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
  async authorize(credentials: Record<string, unknown> | undefined) {
        const adminUser = resolveEnvUser();
        const parsed = credentialsSchema.safeParse(credentials ?? {});

        if (!adminUser || !parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        if (email.toLowerCase() !== adminUser.email.toLowerCase()) {
          return null;
        }

        const isValid = await verifyPassword(password, adminUser.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          roles: adminUser.roles,
        } satisfies User & { roles: string[] };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | null }) {
      if (user) {
        token.userId = user.id;
        token.roles = (user as unknown as { roles?: string[] }).roles ?? ["admin"];
      }
      return token;
    },
  async session({ session, token }: { session: Session; token: JWT }) {
      const roles = (token.roles as string[]) ?? [];
      const nextSession: Session = {
        ...session,
        user: {
          ...session.user,
          id: token.userId as string | undefined,
          roles,
        },
        roles,
      } as Session & { roles: string[] };
      return nextSession;
    },
  },
};
