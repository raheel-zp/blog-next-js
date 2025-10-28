import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        author: data.author,
        content: data.content,
        excerpt: data.excerpt || data.content.slice(0, 100) + '...',
        date: new Date(),
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
