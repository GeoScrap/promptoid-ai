import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prompts = await prisma.prompt.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { originalPrompt, refinedPrompt } = await request.json();

    if (!originalPrompt || !refinedPrompt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a title from the original prompt
    const title = originalPrompt.split(' ').slice(0, 5).join(' ') + '...';

    const prompt = await prisma.prompt.create({
      data: {
        title,
        content: refinedPrompt, // For backward compatibility
        originalPrompt,
        refinedPrompt,
        userId: session.user.id,
      },
    });

    return NextResponse.json(prompt);
  } catch (error) {
    console.error("Error creating prompt:", error);
    return NextResponse.json({ error: "Failed to create prompt" }, { status: 500 });
  }
}