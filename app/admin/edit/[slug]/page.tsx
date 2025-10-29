import { prisma } from '@/app/lib/prisma';
import EditPostForm from '@/app/components/EditPostForm';

export default async function EditPostPage(
    {
        params
    }: {
        params: Promise<{ slug: string }>;
    }) {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
        where: { slug: slug },
        include: { categories: true },
    });

    if (!post) {
        return <div className="p-6 text-center text-red-600">Post not found.</div>;
    }

    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
            <EditPostForm post={post} />
        </main>
    );
}
