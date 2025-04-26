import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// This route is for development purposes only
// It allows you to delete a test user to retry signup
export async function DELETE(request: Request) {
  // Only allow in development environment
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Delete the user with the specified email
    const deletedUser = await prisma.user.delete({
      where: {
        email,
      },
    });

    return NextResponse.json({
      message: "Test user deleted successfully",
      email: deletedUser.email,
    });
  } catch (error) {
    console.error("Error deleting test user:", error);
    return NextResponse.json(
      { error: "Failed to delete test user" },
      { status: 500 }
    );
  }
}
