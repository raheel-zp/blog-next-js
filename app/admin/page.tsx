import Link from 'next/link';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdminHome from '../components/admin/AdminHome';
import { signOut } from "next-auth/react";
import LogoutButton from "@/app/components/LogoutButton";

export default async function AdminPage() {

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    return (
        <main className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <Link href="/admin/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    ➕ New Post
                </Link>
                <Link href="/admin/users" className="bg-gray-700 text-white px-4 py-2 rounded">
                    👥 Manage Users
                </Link>
                <LogoutButton />
            </div>
            <AdminHome />
        </main>
    );
}
