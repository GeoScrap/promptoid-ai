import { NextResponse } from "next/server";
import { getServerSession } from "@/app/api/auth/[...supabase]/route";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data: prompts, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { originalPrompt, refinedPrompt } = await request.json();

    if (!originalPrompt || !refinedPrompt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a title from the original prompt
    const title = originalPrompt.split(' ').slice(0, 5).join(' ') + '...';

    const supabase = createServerSupabaseClient();

    const { data: prompt, error } = await supabase
      .from('prompts')
      .insert({
        title,
        content: refinedPrompt, // For backward compatibility
        original_prompt: originalPrompt,
        refined_prompt: refinedPrompt,
        user_id: session.user.id,
        is_favorite: false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(prompt);
  } catch (error) {
    console.error("Error creating prompt:", error);
    return NextResponse.json({ error: "Failed to create prompt" }, { status: 500 });
  }
}