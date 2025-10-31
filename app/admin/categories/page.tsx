"use client";

import useSWR from "swr";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminCategoriesPage() {
    const { data, error, mutate } = useSWR("/api/categories", fetcher);
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const categories = data;

    if (error) return <p className="text-red-600">Failed to load categories.</p>;
    if (!categories) return <p>Loading categories...</p>;

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        setLoadingId(id);
        try {
            const res = await fetch(`/api/categories/by-id/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete category");
            toast.success("Category deleted successfully!");
            mutate();
        } catch (err) {
            toast.error("Error deleting category");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <main className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Manage Categories</h1>
                <Link
                    href="/admin/categories/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    + New Category
                </Link>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2 text-left">Name</th>
                        <th className="border px-4 py-2 text-left">Slug</th>
                        <th className="border px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 ? (
                        categories.map((cat: any) => (
                            <tr key={cat.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{cat.name}</td>
                                <td className="border px-4 py-2">{cat.slug}</td>
                                <td className="border px-4 py-2 space-x-2">
                                    <Link
                                        href={`/admin/categories/${cat.id}/edit`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        disabled={loadingId === cat.id}
                                        className="text-red-600 hover:underline disabled:opacity-50"
                                    >
                                        {loadingId === cat.id ? "Deleting..." : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="text-center py-4">
                                No categories found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </main>
    );
}
