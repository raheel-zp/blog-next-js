"use client";

import useSWR from "swr";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminCommentsPage() {
    const { data, error, mutate } = useSWR("/api/comments", fetcher);
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const comments = data;

    if (error) return <p className="text-red-600">Failed to load comments.</p>;
    if (!comments) return <p>Loading comments...</p>;

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        setLoadingId(id);
        try {
            const res = await fetch(`/api/comments/by-id/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete comment");
            toast.success("Comment deleted successfully!");
            mutate();
        } catch (err) {
            toast.error("Error deleting comment");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <main className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Comments</h1>

            <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2 text-left">Comment</th>
                        <th className="border px-4 py-2 text-left">Author</th>
                        <th className="border px-4 py-2 text-left">Post</th>
                        <th className="border px-4 py-2 text-left">Date</th>
                        <th className="border px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {comments.length > 0 ? (
                        comments.map((comment: any) => (
                            <tr key={comment.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{comment.content}</td>
                                <td className="border px-4 py-2">{comment.author?.name || "N/A"}</td>
                                <td className="border px-4 py-2">
                                    <Link
                                        href={`/admin/posts/${comment.post.id}/edit`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {comment.post.title}
                                    </Link>
                                </td>
                                <td className="border px-4 py-2">{new Date(comment.createdAt).toLocaleDateString()}</td>
                                <td className="border px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        disabled={loadingId === comment.id}
                                        className="text-red-600 hover:underline disabled:opacity-50"
                                    >
                                        {loadingId === comment.id ? "Deleting..." : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-4">
                                No comments found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </main>
    );
}
