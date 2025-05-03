import { NextResponse } from "next/server";
import { getServerSession } from "@/app/api/auth/[...supabase]/route";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data: prompt, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
      }
      throw error;
    }

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    return NextResponse.json(prompt);
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return NextResponse.json({ error: "Failed to fetch prompt" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isFavorite } = await request.json();

    const supabase = createServerSupabaseClient();

    const { data: prompt, error } = await supabase
      .from('prompts')
      .update({ is_favorite: isFavorite })
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(prompt);
  } catch (error) {
    console.error("Error updating prompt:", error);
    return NextResponse.json({ error: "Failed to update prompt" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', params.id)
      .eq('user_id', session.user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return NextResponse.json({ error: "Failed to delete prompt" }, { status: 500 });
  }
}