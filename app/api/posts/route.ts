import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET /api/posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
