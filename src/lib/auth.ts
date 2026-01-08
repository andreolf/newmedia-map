import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID!,
      clientSecret: process.env.AUTH_TWITTER_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the Twitter username in the JWT
      if (account && profile) {
        token.twitterHandle = (profile as { data?: { username?: string } }).data?.username || 
                             (profile as { screen_name?: string }).screen_name;
        token.twitterId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      // Make Twitter info available in the session
      if (session.user) {
        (session.user as { twitterHandle?: string }).twitterHandle = token.twitterHandle as string;
        (session.user as { twitterId?: string }).twitterId = token.twitterId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Extended types
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      twitterHandle?: string;
      twitterId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    twitterHandle?: string;
    twitterId?: string;
  }
}

