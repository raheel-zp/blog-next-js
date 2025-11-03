import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req: Request, {
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("GET /api/categories/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, {
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    return NextResponse.json({ category: updatedCategory });
  } catch (error) {
    console.error("PUT /api/categories/[id] error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const resolvedParams = await params;
    const categoryId = Number(resolvedParams.id);

    if (!categoryId || isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
