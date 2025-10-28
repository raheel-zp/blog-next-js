import { notFound } from "next/navigation";
import { marked } from "marked";
import Image from "next/image";
import Comments from "./comments";
import { Post } from "@/types/post";

async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-4">{post.title}</h1>
      <Image
        src={post.image}
        alt={post.title}
        width={800}
        height={400}
        className="rounded-xl mb-6 shadow-md"
      />
      <article
        className="prose lg:prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: marked(post.content) }}
      />
      <div className="mt-10">
        <Comments slug={slug} />
      </div>
    </main>
  );
}
