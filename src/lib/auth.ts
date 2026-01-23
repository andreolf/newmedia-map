import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";
import type { NextAuthConfig } from "next-auth";

// Admin Twitter handles (can manage all chapters)
const ADMIN_HANDLES = ["andreolf"]; // Add your Twitter handle here

// Curator permissions by chapter (Twitter handle -> chapter IDs)
const CURATOR_PERMISSIONS: Record<string, string[]> = {
  // Example: "curator_handle": ["new-media-europe", "new-media-africa"]
};

export type UserRole = "admin" | "curator" | "user";

export function getUserRole(twitterHandle?: string): UserRole {
  if (!twitterHandle) return "user";
  if (ADMIN_HANDLES.includes(twitterHandle.toLowerCase())) return "admin";
  if (twitterHandle.toLowerCase() in CURATOR_PERMISSIONS) return "curator";
  return "user";
}

export function getCuratorChapters(twitterHandle?: string): string[] {
  if (!twitterHandle) return [];
  const role = getUserRole(twitterHandle);
  if (role === "admin") return ["*"]; // Admin can manage all
  return CURATOR_PERMISSIONS[twitterHandle.toLowerCase()] || [];
}

export function canManageCreator(twitterHandle?: string, creatorChapterIds?: string[]): boolean {
  const role = getUserRole(twitterHandle);
  if (role === "admin") return true;
  if (role !== "curator") return false;
  
  const curatorChapters = getCuratorChapters(twitterHandle);
  if (!creatorChapterIds || creatorChapterIds.length === 0) return false;
  return creatorChapterIds.some(id => curatorChapters.includes(id));
}

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
        const handle = token.twitterHandle as string;
        (session.user as { twitterHandle?: string }).twitterHandle = handle;
        (session.user as { twitterId?: string }).twitterId = token.twitterId as string;
        (session.user as { role?: UserRole }).role = getUserRole(handle);
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
      role?: UserRole;
    };
  }
}


