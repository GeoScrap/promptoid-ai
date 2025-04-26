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
        // Check if the URL starts with the base URL
        if (url.startsWith(baseUrl)) {
          return url;
        }

        // Handle callback URLs with specific paths
        if (url.startsWith('/dashboard') || url === '/dashboard') {
          return `${baseUrl}/dashboard`;
        }

        // Default fallback based on environment
        if (process.env.NODE_ENV === 'production') {
          return 'https://promptoid-rkw1ka54a-avdhut-thorats-projects.vercel.app/dashboard';
        } else {
          return 'http://localhost:3000/dashboard';
        }
      } catch (error) {
        console.error('Error in redirect callback:', error);
        // If anything goes wrong, use a safe fallback
        if (process.env.NODE_ENV === 'production') {
          return 'https://promptoid-rkw1ka54a-avdhut-thorats-projects.vercel.app';
        } else {
          return 'http://localhost:3000';
        }
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };