import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create Supabase server client
    const supabase = createServerSupabaseClient();

    // Sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Direct login API error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    console.log("Direct login API success, session:", !!data.session);
    console.log("Direct login API success, user:", !!data.user);

    // Set cache control headers to prevent caching
    const response = NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });
    
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    
    return response;
  } catch (error) {
    console.error("Error in direct login API:", error);
    
    return NextResponse.json(
      { error: "Failed to sign in" },
      { status: 500 }
    );
  }
}
