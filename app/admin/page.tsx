"use client";

import useSWR from "swr";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { redirect } from "next/navigation";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminDashboard() {

    const { data: session } = useSession();
    if (session && session.user.role !== "ADMIN") {
        redirect("/login");
    }

    // Fetch summary and latest data
    const { data: summary } = useSWR("/api/admin/summary", fetcher);
    const { data: latestPosts } = useSWR("/api/admin/latest-posts", fetcher);
    const { data: latestComments } = useSWR("/api/admin/latest-comments", fetcher);

    if (!summary) return <p>Loading dashboard...</p>;

    const stats = [
        { title: "Users", count: summary.usersCount, link: "/admin/users" },
        { title: "Posts", count: summary.postsCount, link: "/admin/posts" },
        { title: "Comments", count: summary.commentsCount, link: "/admin/comments" },
        { title: "Categories", count: summary.categoriesCount, link: "/admin/categories" },
    ];

    return (
        <main className="max-w-7xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Link
                        key={stat.title}
                        href={stat.link}
                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition flex flex-col items-center justify-center"
                    >
                        <h2 className="text-xl font-semibold mb-2">{stat.title}</h2>
                        <p className="text-3xl font-bold">{stat.count}</p>
                    </Link>
                ))}
            </div>

            <section className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Latest Posts</h2>
                {latestPosts?.length ? (
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2 text-left">Title</th>
                                <th className="border px-4 py-2 text-left">Author</th>
                                <th className="border px-4 py-2 text-left">Date</th>
                                <th className="border px-4 py-2 text-left">Comments</th>
                                <th className="border px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {latestPosts.map((post: any) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">{post.title}</td>
                                    <td className="border px-4 py-2">{post.author || "N/A"}</td>
                                    <td className="border px-4 py-2">
                                        {new Date(post.date).toLocaleDateString()}
                                    </td>
                                    <td className="border px-4 py-2">{post.comments?.length || 0}</td>
                                    <td className="border px-4 py-2 space-x-2">
                                        <Link
                                            href={`/admin/edit/${post.slug}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            className="text-gray-600 hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No recent posts.</p>
                )}
            </section>

            <section className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Latest Comments</h2>
                {latestComments?.length ? (
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2 text-left">Comment</th>
                                <th className="border px-4 py-2 text-left">Author</th>
                                <th className="border px-4 py-2 text-left">Post</th>
                                <th className="border px-4 py-2 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {latestComments.map((comment: any) => (
                                <tr key={comment.id} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">{comment.content}</td>
                                    <td className="border px-4 py-2">{comment.author.name || "N/A"}</td>
                                    <td className="border px-4 py-2">
                                        <Link
                                            href={`/blog/${comment.post.slug}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {comment.post.title}
                                        </Link>
                                    </td>
                                    <td className="border px-4 py-2">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No recent comments.</p>
                )}
            </section>
        </main>
    );
}
