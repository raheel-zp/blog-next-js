import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  {
  params,
}: {
  params: Promise<{ slug: string }>;
}
) {
  try {
    const { slug } = await params;
    const category = await prisma.category.findUnique({
      where: { slug: slug },
      include: {
        posts: {
          include: {
            User: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("GET /api/categories/category/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}
