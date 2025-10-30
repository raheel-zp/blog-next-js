'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface User {
    id: number;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users");
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to load users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (res.ok) {
            toast.success("✅ User deleted successfully!");
            setUsers(users.filter((user) => user.id !== id));
            router.refresh();
        } else {
            const data = await res.json();
            toast.error(`❌ ${data.error || "Failed to delete user"}`);
        }
    };

    if (loading) return <p className="p-6 text-gray-500">Loading users...</p>;

    return (
        <main className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <Link
                    href="/admin/users/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    ➕ Add User
                </Link>
            </div>

            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Role</th>
                            <th className="border p-2">Created At</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="text-center">
                                <td className="border p-2">{user.id}</td>
                                <td className="border p-2">{user.name || "-"}</td>
                                <td className="border p-2">{user.email}</td>
                                <td className="border p-2">{user.role}</td>
                                <td className="border p-2">{new Date(user.createdAt).toLocaleString()}</td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
}
