import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to load categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    const slugify = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const slug = slugify(name);

    // ✅ FIXED: Prisma requires a `data` object
    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json({ category: newCategory }, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}