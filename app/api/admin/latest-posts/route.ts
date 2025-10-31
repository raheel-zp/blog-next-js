import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch latest 5 posts
    const posts = await prisma.post.findMany({
      orderBy: { date: "desc" }, // or createdAt if you have that field
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        author: true,
        date: true,
        comments: true, // optional to show number of comments
      },
    });

    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch latest posts" },
      { status: 500 }
    );
  }
}
