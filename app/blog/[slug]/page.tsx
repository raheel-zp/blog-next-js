import prisma from '@/lib/prisma';
import { notFound } from "next/navigation";
import Image from "next/image";
import Comments from "./comments";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug: slug },
    include: {
      categories: true,
      comments: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Image
        src={post.image || "/images/placeholder.png"}
        alt={post.title}
        width={800}
        height={400}
        className="rounded mb-6"
      />
      <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
      <p className="text-gray-600 mb-4">{post.excerpt}</p>
      <div className="prose mb-8">{post.content}</div>
      <Comments postId={post.id} />
    </main>
  );
}
