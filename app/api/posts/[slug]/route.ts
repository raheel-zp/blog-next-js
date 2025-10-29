import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { PostSchema } from '@/app/lib/validation';

export async function GET(
{
  params,
}: {
  params: Promise<{ slug: string }>;
}
) {
  try {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
    comments: true,
    categories: true,
  },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }>; }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const parseResult = PostSchema.safeParse(body);

    if (!parseResult.success) {
      const errors = parseResult.error.flatten().fieldErrors;
      return NextResponse.json({ errors }, { status: 400 });
    }

    const data = parseResult.data;

    const updatedPost = await prisma.post.update({
      where: { slug: slug },
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        categories: {
          set: [], // clear old links
          connectOrCreate: (data.categories || []).map((name: string) => ({
            where: { name },
            create: { 
              name, 
             slug: name.toLowerCase().replace(/\s+/g, '-') },
          })),
        },
      },
      include: { categories: true },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}
