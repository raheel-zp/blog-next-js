import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PostSchema } from '@/app/lib/validation';

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = PostSchema.safeParse(body);
    if (!parseResult.success) {
      const errors = parseResult.error.flatten().fieldErrors;
      return NextResponse.json({ errors }, { status: 400 });
    }

    const data = parseResult.data;

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: generateSlug(data.title),
        author: data.author,
        content: data.content,
        excerpt: data.excerpt || data.content.slice(0, 100) + '...',
        date: new Date(),
        categories: {
          connectOrCreate: (data.categories || []).map((name: string) => ({
            where: { name },
            create: { 
              name,
              slug: generateSlug(name) 
            },
          })),
        },
      },
      include: { categories: true },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
