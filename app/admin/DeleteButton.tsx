import { useRouter } from "next/navigation";
export function DeleteButton({ postId }: { postId: number }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        const res = await fetch(`/api/posts/by-id/${postId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            alert('Post deleted successfully!');
            router.refresh();
        } else {
            const data = await res.json();
            alert(`Error: ${data.error}`);
        }
    };

    return (
        <button onClick={handleDelete} className="text-red-600 hover:underline">
            Delete
        </button>
    );
}