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

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Create Supabase server client
    const supabase = createServerSupabaseClient();

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // Check for specific errors
      if (error.message.includes("already registered")) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      user: data.user,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}