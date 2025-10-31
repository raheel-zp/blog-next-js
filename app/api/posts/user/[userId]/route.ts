import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, {
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const posts = await prisma.post.findMany({
    where: { userId: parseInt(userId) },
    orderBy: { date: "desc" },
    include: { categories: true },
  });

  return NextResponse.json({ posts });
}
