import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.post.createMany({
    data: [
      {
        slug: 'getting-started-with-nextjs',
        title: 'Getting Started with Next.js',
        excerpt: 'Learn the basics of Next.js App Router, components, and routing.',
        image: '/images/post1.jpg',
        date: new Date('2025-10-20'),
        author: 'Raheel',
        content: `
          ## Introduction
          Next.js is a React framework that enables server-side rendering and static site generation.

          ### Key Features
          - File-based routing
          - API routes
          - Server & Client Components
          - Image Optimization
        `,
      },
      {
        slug: 'understanding-server-components',
        title: 'Understanding Server Components',
        excerpt: 'Discover the power of server components and how they improve performance.',
        image: '/images/post2.jpg',
        date: new Date('2025-10-22'),
        author: 'Raheel',
        content: `
          ## Why Server Components
          Server Components allow rendering UI on the server, reducing client bundle size.

          ### Benefits
          - Faster load times
          - Easier data fetching
          - Reduced client JavaScript
        `,
      },
      {
        slug: 'nextjs-routing-made-easy',
        title: 'Next.js Routing Made Easy',
        excerpt: 'Learn about dynamic routes in Next.js using [slug] syntax...',
        image: '/images/post3.jpg',
        date: new Date('2025-10-25'),
        author: 'Raheel',
        content: '<p>Dynamic routes in Next.js can be created using [slug] syntax...</p>',
      },
    ],
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
