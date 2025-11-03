"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function EditCategoryPage() {
    const router = useRouter();
    const { id } = useParams();
    const [formData, setFormData] = useState({ name: "" });
    const [loading, setLoading] = useState(true);

    // Fetch category by ID
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch(`/api/categories/${id}`);
                if (!res.ok) throw new Error("Failed to load category");

                const data = await res.json();
                setFormData({
                    name: data.category.name,
                });
            } catch (err: any) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCategory();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update category");

            toast.success("Category updated successfully!");
            router.push("/admin/categories");
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    if (loading) return <p className="text-center py-8">Loading...</p>;

    return (
        <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded-2xl shadow">
            <h1 className="text-2xl font-semibold mb-6">Edit Category</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value.trim() })}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
}
