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
        <button onClick={handleDelete} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
            Delete
        </button>
    );
}