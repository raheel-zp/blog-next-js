// app/page.tsx
import Link from "next/link";
import { notFound } from 'next/navigation';
import { Post } from "@/types/post";

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`);
  const data = await res.json();
  const posts = data.posts;
  return posts || null;
}

export default async function HomePage() {
  const posts: Post[] = await getPosts();
  if (!posts) notFound();
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog Explorer</h1>
      <div className="grid gap-6">
        {posts.map((post: Post) => (
          <Link
            href={`/blog/${post.slug}`}
            key={post.id}
            className="block p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="text-gray-600 mt-2">{post.excerpt}</p>
            <p className="text-sm text-gray-400 mt-4">
              Published on {new Date(post.date).toDateString()}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
