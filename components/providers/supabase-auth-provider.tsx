"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Mock user type to match the structure expected by components
type MockUser = {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
};

// Mock session type
type MockSession = {
  user: MockUser;
};

type SupabaseAuthContextType = {
  user: MockUser | null;
  session: MockSession | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: MockUser | null; session: MockSession | null } | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: MockUser | null } | null;
  }>;
  signOut: () => Promise<void>;
  signInWithGoogle: (redirectPath?: string) => Promise<void>;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: null, data: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  signInWithGoogle: async (redirectPath?: string) => {},
});

export const useSupabaseAuth = () => useContext(SupabaseAuthContext);

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create a mock user for development
  const mockUser: MockUser = {
    id: "mock-user-id",
    email: "user@example.com",
    user_metadata: {
      full_name: "Demo User",
      avatar_url: "https://ui-avatars.com/api/?name=Demo+User&background=random",
    },
  };

  const mockSession: MockSession = {
    user: mockUser,
  };

  const [user, setUser] = useState<MockUser | null>(mockUser);
  const [session, setSession] = useState<MockSession | null>(mockSession);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading state briefly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Mock authentication functions
  const signIn = async (_email: string, _password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      error: null,
      data: {
        user: mockUser,
        session: mockSession
      }
    };
  };

  const signUp = async (_email: string, _password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      error: null,
      data: {
        user: mockUser
      }
    };
  };

  const signOut = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Don't actually sign out in the mock version
    router.push("/login");
  };

  const signInWithGoogle = async (redirectPath: string = "/dashboard") => {
    // Simulate redirect
    window.location.href = redirectPath;
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}
