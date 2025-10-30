"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface AddCommentFormProps {
    postId: number;
    onCommentAdded: (newComment: any) => void;
}

export default function AddCommentForm({ postId, onCommentAdded }: AddCommentFormProps) {
    const { data: session } = useSession();
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!comment.trim()) {
            toast.error("Please enter a comment.");
            return;
        }

        const newComment = {
            id: Math.random(), // temporary ID for instant UI
            content: comment,
            author: { name: session?.user?.name || "You" },
            createdAt: new Date().toISOString(),
        };

        // Optimistic update
        onCommentAdded(newComment);
        setComment("");

        try {
            setIsSubmitting(true);
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    authorId: session?.user.id,
                }),
            });

            if (!res.ok) throw new Error("Failed to post comment");

            toast.success("Comment added successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to add comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!session) {
        return (
            <p className="text-gray-500 mt-4">
                Please <span className="font-medium text-blue-600">login</span> to post a comment.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
                className="border rounded-md p-2 w-full focus:outline-blue-500"
                rows={3}
                placeholder="Add your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSubmitting}
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="self-end bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
            >
                {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
        </form>
    );
}
