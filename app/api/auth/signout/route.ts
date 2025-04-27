import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST() {
  try {
    // Create Supabase server client
    const supabase = createServerSupabaseClient();

    // Sign out the user
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Error signing out:", error);
    
    return NextResponse.json(
      { error: "Failed to sign out" },
      { status: 500 }
    );
  }
}
