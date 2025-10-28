import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET /api/comments?slug=post-slug
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { slug: slug },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST /api/comments
export async function POST(request: Request) {
  try {
    const { slug, name, message } = await request.json();

    if (!slug || !name || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
      data: { slug, name, text: message },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
