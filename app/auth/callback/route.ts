import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    // Get the URL object
    const url = new URL(request.url);

    // Get the code from query parameters
    const code = url.searchParams.get('code');

    // Get the redirect URL from query parameters
    const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';

    if (!code) {
      console.error("Missing code in auth callback");
      return NextResponse.redirect(`${url.origin}/login?error=missing_code`);
    }

    // Create Supabase server client
    const supabase = createServerSupabaseClient();

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(`${url.origin}/login?error=auth_callback_error`);
    }

    console.log("Auth callback successful, session established:", !!data.session);
    console.log("Redirecting to:", redirectTo);

    // Make sure redirectTo starts with a slash
    const normalizedRedirectTo = redirectTo.startsWith('/') ? redirectTo : `/${redirectTo}`;

    // Set cookies in the response
    const response = NextResponse.redirect(`${url.origin}${normalizedRedirectTo}`);

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, max-age=0');

    return response;
  } catch (error) {
    console.error("Error in auth callback:", error);
    return NextResponse.redirect(`${url.origin}/login?error=unknown_error`);
  }
}
