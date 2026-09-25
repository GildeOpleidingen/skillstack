import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const requiredEnv = [
  "AUTH_SECRET",
  "AUTH_GITHUB_ID",
  "AUTH_GITHUB_SECRET",
] as const;

for (const key of requiredEnv) {
  if (!process.env[key] || process.env[key]?.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const env = {
  AUTH_SECRET: process.env.AUTH_SECRET as string,
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID as string,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET as string,
};

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      console.log("GitHub ID:", profile?.id);

      // Send user data to backend database
      if (profile) {
        // TODO POST request to save 
      }

      return true;
    },
    async jwt({ token, profile }) {
      if (profile) {
        console.log("GitHub ID in jwt:", profile.id);
        // TODO Fetch the user ID from backend using GitHub ID
      }
      // TODO return token
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  trustHost: true,
});
