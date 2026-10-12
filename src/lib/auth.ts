import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import { prisma } from "@/lib/prisma";

type AuthOptions = {
  disableSignUp?: boolean;
  includeNextCookies?: boolean;
};

export function createAuthOptions(
  { disableSignUp = true, includeNextCookies = true }: AuthOptions = {},
) {
  return {
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: {
      enabled: true,
      disableSignUp,
      minPasswordLength: 10,
      maxPasswordLength: 128,
    },
    advanced: {
      cookiePrefix: "code-flex-admin",
      useSecureCookies: process.env.NODE_ENV === "production",
    },
    plugins: includeNextCookies ? [nextCookies()] : [],
  };
}

export const auth = betterAuth(createAuthOptions());
