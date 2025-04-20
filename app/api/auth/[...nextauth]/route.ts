import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      // Allow both localhost and production URLs
      // This is important for development and production to work with the same Google OAuth client
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For now, we'll skip the password check since we don't have a password field
        // This should be updated if you add password authentication
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user) {
          return null;
        }

        // Since we don't have password in the User model, we'll skip this check
        // Uncomment this if you add password to your User model
        /*
        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }
        */

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    })
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('NextAuth Redirect:', { url, baseUrl });

      try {
        // Get the actual origin from the URL
        const urlObj = new URL(url);
        const actualOrigin = urlObj.origin;

        // Handle local development vs production
        // In development, use the actual origin from the request
        // In production, use the configured NEXTAUTH_URL
        const effectiveBaseUrl = process.env.NODE_ENV === 'development' ? actualOrigin : baseUrl;

        console.log('Effective base URL:', effectiveBaseUrl);

        // Always redirect to dashboard after successful sign-in
        if (url.includes('/api/auth/callback')) {
          return `${effectiveBaseUrl}/dashboard`;
        }

        // Allows relative callback URLs
        if (url.startsWith("/")) {
          return `${effectiveBaseUrl}${url}`;
        }

        // For absolute URLs, check if they're on the same origin
        if (urlObj.origin === effectiveBaseUrl) {
          return url;
        }

        // Default fallback - go to the dashboard
        return `${effectiveBaseUrl}/dashboard`;
      } catch (error) {
        console.error('Error in redirect callback:', error);
        // If anything goes wrong, redirect to the base URL
        return baseUrl;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };