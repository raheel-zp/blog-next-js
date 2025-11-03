import NewPostForm from "@/app/components/NewPostForm";

export default function CreatePostPage() {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
            <h1 className="text-2xl font-semibold mb-6">Create New Post</h1>
            <NewPostForm redirectUrl={`/admin/posts`} />
        </div>
    );
}
