import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    console.log(searchParams);
    const query = searchParams.get("q") || "";
    const postId = searchParams.get("postId") || "";
    const author = searchParams.get("author") || "";

    const where: any = {};

    if (query) {
      where.OR = [
        { content: { contains: query } },
        { author: { name: { contains: query } } },
      ];
    }

    if (postId) where.postId = Number(postId);
    if (author) where.author = { name: { contains: author } };

    const comments = await prisma.comment.findMany({
      where,
      include: {
        post: { select: { title: true, slug: true } },
        author: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("GET /api/admin/comments error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}
