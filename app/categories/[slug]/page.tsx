import Link from "next/link";
import Image from "next/image";

async function getCategory(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/category/${slug}`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch category");
    return res.json();
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const category = await getCategory(slug);

    return (
        <main className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
            <p className="text-gray-500 mb-8">Slug: {category.slug}</p>

            {category.posts.length === 0 ? (
                <p className="text-gray-600">No posts yet in this category.</p>
            ) : (
                <div className="space-y-6">
                    {category.posts.map((post: any) => (
                        <article
                            key={post.id}
                            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            {post.image && (
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    width={600}
                                    height={300}
                                    className="rounded mb-3"
                                />
                            )}
                            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                            <p className="text-gray-600 mb-3">{post.excerpt}</p>
                            <p className="text-sm text-gray-500">
                                By {post.author?.name || "Unknown"}
                            </p>
                            <Link
                                href={`/blog/${post.slug}`}
                                className="text-blue-600 font-medium inline-block mt-2"
                            >
                                Read More →
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}
