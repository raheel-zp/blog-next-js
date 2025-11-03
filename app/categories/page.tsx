import Link from "next/link";

async function getCategories() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <main className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">All Categories</h1>

            {categories.length === 0 ? (
                <p className="text-gray-600">No categories yet.</p>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {categories.map((cat: any) => (
                        <Link
                            key={cat.id}
                            href={`/categories/${cat.slug}`}
                            className="block border rounded-xl p-5 shadow-sm hover:shadow-md transition"
                        >
                            <h2 className="text-xl font-semibold mb-1">{cat.name}</h2>
                            <p className="text-sm text-gray-500">
                                {cat._count.posts} post{cat._count.posts !== 1 && "s"}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
