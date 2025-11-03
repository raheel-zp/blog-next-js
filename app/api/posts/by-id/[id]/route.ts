import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    const postId = Number(resolvedParams.id);

    if (!postId || isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(params.id) },
      include: {
        User: {
          select: { name: true, email: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("GET /api/posts/by-id error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
