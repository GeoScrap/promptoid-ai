import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// Helper function to get a mock session (authentication disabled)
export async function getServerSession() {
  // Return a mock session with a mock user
  return {
    user: {
      id: "mock-user-id",
      name: "Demo User",
      email: "user@example.com",
      image: "https://ui-avatars.com/api/?name=Demo+User&background=random",
    }
  };
}

// Default handler for any requests to this route
export async function GET() {
  return NextResponse.json({ message: "Supabase Auth API" });
}
