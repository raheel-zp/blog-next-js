"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function NewCategoryPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to create category");

            toast.success("Category created successfully!");
            router.push("/admin/categories");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded-2xl shadow">
            <h1 className="text-2xl font-semibold mb-6">Add New Category</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value.trim() })}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="Category name"
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
                        disabled={loading}
                        className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
}
