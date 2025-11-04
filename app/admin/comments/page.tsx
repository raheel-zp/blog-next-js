"use client";

import useSWR from "swr";
import { toast } from "react-hot-toast";
import { useState } from "react";
import useDebounce from "@/lib/hooks/useDebounce";

const fetcher = (url: string) =>
    fetch(url).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
    });

export default function AdminCommentsPage() {
    const [query, setQuery] = useState("");
    const [author, setAuthor] = useState("");
    const [postId, setPostId] = useState("");

    const debouncedQuery = useDebounce(query);
    const debouncedAuthor = useDebounce(author);
    const debouncedPostId = useDebounce(postId);

    const { data, error, mutate, isLoading } = useSWR(
        `/api/admin/comments?q=${debouncedQuery}&author=${debouncedAuthor}&postId=${debouncedPostId}`,
        fetcher
    );

    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Comment deleted successfully!");
            mutate(); // refresh comments
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete comment.");
        } finally {
            setDeletingId(null);
        }
    };

    if (error) return <p className="text-red-600">Failed to load comments.</p>;
    if (isLoading) return <p>Loading comments...</p>;

    const comments = data?.comments || [];

    const handleReset = () => {
        setQuery("");
        setAuthor("");
        setPostId("");
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Manage Comments</h1>
            {/* Search Inputs */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search content..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="border rounded-md p-2 w-64 pr-8"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                            title="Clear"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by author..."
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="border rounded-md p-2 w-64 pr-8"
                    />
                    {author && (
                        <button
                            onClick={() => setAuthor("")}
                            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                            title="Clear"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by Post ID..."
                        value={postId}
                        onChange={(e) => setPostId(e.target.value)}
                        className="border rounded-md p-2 w-48 pr-8"
                    />
                    {postId && (
                        <button
                            onClick={() => setPostId("")}
                            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                            title="Clear"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <button
                    onClick={handleReset}
                    className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded-md transition"
                >
                    Reset Filters
                </button>
            </div>

            {comments.length === 0 ? (
                <p className="text-gray-500">No comments yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg shadow-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-3 border-b">Content</th>
                                <th className="p-3 border-b">Author</th>
                                <th className="p-3 border-b">Post</th>
                                <th className="p-3 border-b">Date</th>
                                <th className="p-3 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map((comment: any) => (
                                <tr key={comment.id} className="hover:bg-gray-50">
                                    <td className="p-3 border-b max-w-md truncate">{comment.content}</td>
                                    <td className="p-3 border-b">
                                        {comment.author?.name || "Anonymous"}<br />
                                        <span className="text-sm text-gray-500">{comment.author?.email}</span>
                                    </td>
                                    <td className="p-3 border-b">
                                        <a
                                            href={`/blog/${comment.post.slug}`}
                                            className="text-blue-600 hover:underline"
                                            target="_blank"
                                        >
                                            {comment.post.title}
                                        </a>
                                    </td>
                                    <td className="p-3 border-b text-sm text-gray-500">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </td>
                                    <td className="p-3 border-b">
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            disabled={deletingId === comment.id}
                                            className={`px-3 py-1 rounded ${deletingId === comment.id
                                                ? "bg-gray-300"
                                                : "bg-red-600 hover:bg-red-700 text-white"
                                                }`}
                                        >
                                            {deletingId === comment.id ? "Deleting..." : "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
