import NextAuth from "next-auth";

import { authOptions } from "./options";

export const { auth, signIn, signOut, handlers } = NextAuth(authOptions);
