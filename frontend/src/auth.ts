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
  handlers: { GET, POST },
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
        try {
          const response = await fetch('http://localhost:4000/auth/github/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: profile.id,
              login: profile.login,
              name: profile.name,
              email: profile.email,
              avatar_url: profile.avatar_url,
              html_url: profile.html_url,
            }),
          });

          if (!response.ok) {
            console.error('Failed to save user to backend:', response.statusText);
          } else {
            // Get the user data from backend to get the internal user ID
            const userData = await response.json();
            console.log('User data from backend:', userData);
          }
        } catch (error) {
          console.error('Error saving user to backend:', error);
        }
      }

      return true;
    },
    async jwt({ token, profile }) {
      if (profile) {
        console.log("GitHub ID in jwt:", profile.id);
        // Fetch the user ID from backend using GitHub ID
        try {
          const response = await fetch(`http://localhost:4000/auth/github/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: profile.id,
              login: profile.login,
              name: profile.name,
              email: profile.email,
              avatar_url: profile.avatar_url,
              html_url: profile.html_url,
            }),
          });

          if (response.ok) {
            const userData = await response.json();
            token.id = userData.id; // Store internal user ID in token
          }
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
      }
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
