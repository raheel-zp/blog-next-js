"use client";

import useSWR from "swr";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminCategoriesPage() {
    const { data: categories, mutate } = useSWR("/api/categories", fetcher);
    const [name, setName] = useState("");
    const [editing, setEditing] = useState<number | null>(null);

    const handleAdd = async () => {
        if (!name.trim()) return toast.error("Category name is required");
        const res = await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (res.ok) {
            toast.success("Category added");
            setName("");
            mutate();
        } else toast.error("Failed to add category");
    };

    const handleEdit = async (id: number, currentName: string) => {
        setEditing(id);
        setName(currentName);
    };

    const handleUpdate = async (id: number) => {
        if (!name.trim()) return toast.error("Name cannot be empty");
        const res = await fetch(`/api/categories/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (res.ok) {
            toast.success("Category updated");
            setEditing(null);
            setName("");
            mutate();
        } else toast.error("Failed to update");
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this category?")) return;
        const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
        if (res.ok) {
            toast.success("Category deleted");
            mutate();
        } else toast.error("Failed to delete");
    };

    if (!categories) return <p className="p-6">Loading...</p>;

    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

            <div className="flex items-center gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Enter category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-full"
                />
                {editing ? (
                    <button
                        onClick={() => handleUpdate(editing)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Update
                    </button>
                ) : (
                    <button
                        onClick={handleAdd}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        Add
                    </button>
                )}
            </div>

            <ul className="space-y-2">
                {categories.map((cat: any) => (
                    <li
                        key={cat.id}
                        className="flex items-center justify-between border p-3 rounded-lg"
                    >
                        <div>
                            <span className="font-semibold">{cat.name}</span>
                            <span className="text-sm text-gray-500 ml-2">
                                ({cat._count?.posts ?? 0} posts)
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={`/categories/${cat.slug}`}
                                className=" text-blue-600 px-3 py-1"
                            >
                                View
                            </Link>
                            <Link
                                href={`/admin/categories/${cat.id}/edit`}
                                className=" text-blue-600 px-3 py-1"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="text-red-600 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    );
}
