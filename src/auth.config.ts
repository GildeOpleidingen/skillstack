import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

const requiredEnv = [
  "AUTH_SECRET",
  "AUTH_GITHUB_ID",
  "AUTH_GITHUB_SECRET",
] as const;

function getRequiredEnv(key: (typeof requiredEnv)[number]) {
  const value = process.env[key];

  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  AUTH_SECRET: getRequiredEnv("AUTH_SECRET"),
  AUTH_GITHUB_ID: getRequiredEnv("AUTH_GITHUB_ID"),
  AUTH_GITHUB_SECRET: getRequiredEnv("AUTH_GITHUB_SECRET"),
};

export const authConfig: NextAuthConfig = {
  secret: env.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  providers: [
    GitHub({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ profile }) {
      return Boolean(profile);
    },

    async jwt({ token, profile }) {
      if (profile?.id) {
        token.id = String(profile.id);
      }

      return token;
    },

    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = String(token.id);
      }

      return session;
    },
  },

  trustHost: true,
};
