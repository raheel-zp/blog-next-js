import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const usersCount = await prisma.user.count();
    const postsCount = await prisma.post.count();
    const commentsCount = await prisma.comment.count();
    const categoriesCount = await prisma.category.count();

    return NextResponse.json({
      usersCount,
      postsCount,
      commentsCount,
      categoriesCount,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch summary data" },
      { status: 500 }
    );
  }
}
