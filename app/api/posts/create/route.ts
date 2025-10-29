import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { PostSchema } from '@/app/lib/validation';

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
        slug: body.slug,
        author: data.author,
        content: data.content,
        excerpt: data.excerpt || data.content.slice(0, 100) + '...',
        date: new Date(),
        categories: {
          connectOrCreate: (data.categories || []).map((name: string) => ({
            where: { name },
            create: { 
              name,
              slug: name.toLowerCase().replace(/\s+/g, '-') 
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
