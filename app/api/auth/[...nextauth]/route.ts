import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  // Set the correct URL for NextAuth
  ...(process.env.NEXTAUTH_URL ? { url: process.env.NEXTAUTH_URL } : {}),
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

        // Find the user by email
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user) {
          return null;
        }

        // Check if the user has a password (might be a social login without password)
        if (!user.password) {
          console.log("User exists but has no password - might be a social login account");
          return null;
        }

        // Verify the password
        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          console.log("Password validation failed");
          return null;
        }

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
  debug: true, // Enable debug mode to get more information
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
        // Production URL
        const productionUrl = 'https://promptoid-69fugreb9-avdhut-thorats-projects.vercel.app';

        // Default dashboard URL
        const dashboardUrl = process.env.NODE_ENV === 'production'
          ? `${productionUrl}/dashboard`
          : `${baseUrl}/dashboard`;

        // If the URL is already absolute and starts with the base URL or production URL, use it
        if (url.startsWith(baseUrl) ||
            (process.env.NODE_ENV === 'production' && url.startsWith(productionUrl))) {
          console.log('Using provided URL:', url);
          return url;
        }

        // If it's a relative URL, make it absolute
        if (url.startsWith('/')) {
          const absoluteUrl = process.env.NODE_ENV === 'production'
            ? `${productionUrl}${url}`
            : `${baseUrl}${url}`;
          console.log('Converting relative URL to absolute:', absoluteUrl);
          return absoluteUrl;
        }

        // For callback URLs, always redirect to dashboard
        if (url.includes('/api/auth/callback')) {
          console.log('Redirecting callback to dashboard:', dashboardUrl);
          return dashboardUrl;
        }

        // Default to dashboard
        console.log('Using default dashboard URL:', dashboardUrl);
        return dashboardUrl;
      } catch (error) {
        console.error('Error in redirect callback:', error);
        // If anything goes wrong, use a safe fallback
        const fallbackUrl = process.env.NODE_ENV === 'production'
          ? 'https://promptoid-69fugreb9-avdhut-thorats-projects.vercel.app/dashboard'
          : `${baseUrl}/dashboard`;

        console.log('Using fallback URL due to error:', fallbackUrl);
        return fallbackUrl;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };