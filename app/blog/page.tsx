import Link from 'next/link';
import Image from 'next/image';
import { Post } from "@/types/post";

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default async function BlogPage() {
  const posts: Post[] = await getPosts();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Blog Explorer</h1>
      <div className="space-y-6">
        {posts.map((post: Post) => (
          <article key={post.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <Image
              src={post.image}
              alt={post.title}
              width={600}
              height={300}
              className="rounded mb-3"
            />
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-3">{post.excerpt}</p>
            <Link href={`/ blog / ${post.slug}`} className="text-blue-600 font-medium">
              Read More →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
