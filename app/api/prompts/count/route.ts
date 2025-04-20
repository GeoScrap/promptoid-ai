import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if we need to count only favorites
    const { searchParams } = new URL(request.url);
    const favorite = searchParams.get('favorite') === 'true';

    // Build the query
    const query = {
      where: {
        userId: session.user.id,
        ...(favorite ? { isFavorite: true } : {})
      }
    };

    // Get the count
    const count = await prisma.prompt.count(query);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error counting prompts:", error);
    return NextResponse.json({ error: "Failed to count prompts" }, { status: 500 });
  }
}
