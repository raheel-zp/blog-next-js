// app/admin/page.tsx
import Link from "next/link";
import { prisma } from "../lib/prisma";
import PostList from "./posts/PostList";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const posts = await prisma.post.findMany({
        include: { comments: true },
        orderBy: { date: "desc" },
    });

    return (
        <main className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">🛠️ Admin Dashboard</h1>

            <Link
                href="/admin/new"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
            >
                ➕ Create New Post
            </Link>

            {/* Pass data to client component */}
            <PostList posts={posts} />
        </main>
    );
}
