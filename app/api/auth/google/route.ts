import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    // Get the URL object
    const url = new URL(request.url);
    
    // Get the redirect URL from query parameters
    const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';
    
    // Create Supabase server client
    const supabase = createServerSupabaseClient();
    
    // Generate the Google OAuth URL
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${url.origin}/auth/callback?redirectTo=${redirectTo}`,
      },
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Redirect to the Google OAuth URL
    return NextResponse.redirect(data.url);
  } catch (error) {
    console.error("Error with Google OAuth:", error);
    
    return NextResponse.json(
      { error: "Failed to initiate Google sign-in" },
      { status: 500 }
    );
  }
}
