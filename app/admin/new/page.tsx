import NewPostForm from "@/app/components/NewPostForm";

export default function NewPostPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <NewPostForm />
    </main>
  );
}
