import { NextResponse } from "next/server";
import { getServerSession } from "@/app/api/auth/[...supabase]/route";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if we need to count only favorites
    const { searchParams } = new URL(request.url);
    const favorite = searchParams.get('favorite') === 'true';

    const supabase = createServerSupabaseClient();

    // Build the query
    let query = supabase
      .from('prompts')
      .select('id', { count: 'exact' })
      .eq('user_id', session.user.id);

    // Add favorite filter if needed
    if (favorite) {
      query = query.eq('is_favorite', true);
    }

    // Get the count
    const { count, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error counting prompts:", error);
    return NextResponse.json({ error: "Failed to count prompts" }, { status: 500 });
  }
}
