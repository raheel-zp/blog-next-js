// app/api/comments/by-post/[postId]/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
  params,
}: {
  params: Promise<{ postId: string }>;
}
) {
  try {
    const { postId } = await params;
    const comments = await prisma.comment.findMany({
      where: { postId: +postId },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}
