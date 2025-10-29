import { notFound } from "next/navigation";
import { marked } from "marked";
import Image from "next/image";
import Comments from "./comments";
import { Post } from "@/types/post";
import { Category } from "@/types/category";

async function getPosts() {
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
  const data = await getPosts();
  const posts = data.posts;
  const post = posts.find((p: Post) => p.slug === slug);

  if (!post) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-4">{post.title}</h1>
      <p className="text-gray-500 mb-4">By {post.author}</p>
      <div>
        <Image
          src={post.image?.trim() || "/images/placeholder.jpg"}
          alt={post.title}
          width={800}
          height={400}
          className="rounded-xl mb-6 shadow-md"
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {post.categories?.map((cat: Category) => (
          <span
            key={cat.id}
            className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"
          >
            {cat.name}
          </span>
        ))}
      </div>
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
