'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function NewUserPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/users/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
            toast.success("✅ User created successfully!");
            router.push("/admin/users");
            router.refresh();
        } else {
            toast.error(`❌ ${data.error || "Failed to create user"}`);
        }
    };

    return (
        <main className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Create New User</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                </select>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create User
                </button>
            </form>
        </main>
    );
}
