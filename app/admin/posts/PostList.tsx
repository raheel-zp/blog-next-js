"use client";
import Link from "next/link";
import { DeleteButton } from "../DeleteButton";

interface PostListProps {
    posts: {
        id: number;
        slug: string;
        title: string;
        excerpt: string;
        author: string;
        date: Date;
        comments: { id: number; name: string; text: string; createdAt: Date }[];
    }[];
}

export default function PostList({ posts }: PostListProps) {

    return (
        <section className="space-y-8">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="border rounded-lg p-4 bg-white shadow-sm transition hover:shadow-md"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">{post.title}</h2>
                            <p className="text-gray-600 text-sm">
                                {new Date(post.date).toLocaleDateString()} • {post.author}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href={`/blog/${post.slug}`}
                                className="text-blue-600 hover:underline"
                            >
                                View
                            </Link>
                            <Link
                                href={`/admin/edit/${post.slug}`}
                                className="text-yellow-600 hover:underline"
                            >
                                Edit
                            </Link>

                            <DeleteButton postId={post.id} />
                        </div>
                    </div>

                    <p className="text-gray-700 mt-3">{post.excerpt}</p>

                    {post.comments.length > 0 && (
                        <details className="mt-3">
                            <summary className="cursor-pointer text-gray-700 font-medium">
                                💬 {post.comments.length} Comment(s)
                            </summary>
                            <ul className="mt-2 space-y-2 pl-4">
                                {post.comments.map((c) => (
                                    <li
                                        key={c.id}
                                        className="border-l pl-3 text-sm text-gray-700"
                                    >
                                        <p>
                                            <span className="font-semibold">{c.name}:</span> {c.text}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(c.createdAt).toLocaleString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    )}
                </div>
            ))}
        </section>
    );
}
