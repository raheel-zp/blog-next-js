"use client";

import useSWR from "swr";
import Link from "next/link";

interface UserHomeProps {
    user: { id: number; role?: string | undefined; } & { name?: string | null | undefined; email?: string | null | undefined; image?: string | null | undefined; };
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function UserHome({ user }: UserHomeProps) {
    // Fetch posts created by this user
    const { data, error } = useSWR(`/api/posts/user/${user.id}`, fetcher);
    const posts = data?.posts;

    if (error) return <p className="text-red-600">Failed to load your posts.</p>;
    if (!posts) return <p>Loading your posts...</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Welcome, {user.name}</h2>

            <section>
                {posts.length > 0 ? (
                    <ul className="space-y-2">
                        {posts.map((post: any) => (
                            <li key={post.id} className="p-4 border rounded hover:bg-gray-50">
                                <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                                    {post.title}
                                </Link>
                                <p className="text-gray-500 text-sm">{new Date(post.date).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You haven't created any posts yet.</p>
                )}
            </section>

            {/* You can add other user-specific sections here, e.g., comments, favorites, etc. */}
        </div>
    );
}
