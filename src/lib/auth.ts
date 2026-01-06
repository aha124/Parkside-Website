import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { kv } from "@vercel/kv";

// Admin emails stored in Vercel KV under key "admin:emails"
// Format: string[] of allowed email addresses

export async function isAdminEmail(email: string): Promise<boolean> {
  try {
    const adminEmails = await kv.get<string[]>("admin:emails");
    if (!adminEmails) {
      // If no admin emails are set, check environment variable fallback
      const fallbackEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim().toLowerCase()) || [];
      return fallbackEmails.includes(email.toLowerCase());
    }
    return adminEmails.map(e => e.toLowerCase()).includes(email.toLowerCase());
  } catch (error) {
    // Fallback to environment variable if KV is not available
    console.error("Error checking admin email:", error);
    const fallbackEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim().toLowerCase()) || [];
    return fallbackEmails.includes(email.toLowerCase());
  }
}

export async function getAdminEmails(): Promise<string[]> {
  try {
    const adminEmails = await kv.get<string[]>("admin:emails");
    if (!adminEmails) {
      return process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || [];
    }
    return adminEmails;
  } catch (error) {
    console.error("Error getting admin emails:", error);
    return process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || [];
  }
}

export async function addAdminEmail(email: string): Promise<void> {
  const current = await getAdminEmails();
  if (!current.includes(email.toLowerCase())) {
    await kv.set("admin:emails", [...current, email.toLowerCase()]);
  }
}

export async function removeAdminEmail(email: string): Promise<void> {
  const current = await getAdminEmails();
  await kv.set("admin:emails", current.filter(e => e.toLowerCase() !== email.toLowerCase()));
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const isAdmin = await isAdminEmail(user.email);
      return isAdmin;
    },
    async session({ session }) {
      // Add isAdmin flag to session
      if (session.user?.email) {
        const isAdmin = await isAdminEmail(session.user.email);
        session.user.isAdmin = isAdmin;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
});

// Extend the session type to include isAdmin
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
    };
  }
}
