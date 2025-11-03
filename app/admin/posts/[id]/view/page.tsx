"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ViewPostPage() {
    const { id } = useParams();
    const router = useRouter();

    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/posts/by-id/${id}`);
                if (!res.ok) throw new Error("Failed to load post");

                const data = await res.json();
                setPost(data.post);
            } catch (err: any) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPost();
    }, [id]);

    if (loading) return <p className="text-center py-8">Loading post...</p>;
    if (!post) return <p className="text-center text-red-500 py-8">Post not found</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow mt-6">
            <button
                onClick={() => router.back()}
                className="text-sm text-blue-600 hover:underline mb-4"
            >
                ← Back
            </button>

            <h1 className="text-3xl font-bold mb-3">{post.title}</h1>

            <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
                <p>Author: {post.author?.name || "Unknown"}</p>
                <p>Status: <span className="capitalize">{post.status}</span></p>
                <p>{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="prose max-w-none text-gray-800 leading-relaxed">
                {post.content}
            </div>
        </div>
    );
}
