"use client";
import useSWR from "swr";
import AddCommentForm from "@/app/components/AddCommentForm";
import { Comment } from "@/types/comment";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
});

export default function Comments({ postId }: { postId: number; }) {
  const { data: comments, error, isLoading, mutate } = useSWR(
    `/api/comments/by-post/${postId}`,
    fetcher
  );

  if (error) return <p className="text-red-600">Failed to load comments.</p>;

  return (
    <>
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <div className="space-y-4">
          {isLoading ? (
            <p>Loading comments...</p>
          ) : !comments || comments.length === 0 ? (
            <p className="text-gray-500">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment: Comment) => (
                <div key={comment.id} className="border rounded p-3 bg-gray-50">
                  <p className="text-gray-800">{comment.content}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    — {comment.author?.name || 'Anonymous'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <div className="mt-8">
        {/* pass mutate to allow AddCommentForm to refresh the list after posting */}
        <AddCommentForm postId={postId} onCommentAdded={async (newComment) => {
          // Optimistically update
          await mutate(async (prevComments = []) => [...prevComments, newComment], false);
        }} />
      </div>
    </>
  );
}
