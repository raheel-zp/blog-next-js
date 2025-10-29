import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get('search')?.trim() || '';
  const category = searchParams.get('category');
  const sort = searchParams.get('sort') === 'asc' ? 'asc' : 'desc';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 5;
  const skip = (page - 1) * limit;
  
  const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'all') {
      where.categories = {
        some: { name: category },
      };
    }

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { date: sort },
        include: {
        comments: true,
        categories: true,
      },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ posts, totalPages });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}
