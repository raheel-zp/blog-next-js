"use client";

import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function LogoutButton() {
    const handleLogout = async () => {
        toast.loading("Logging out...");

        try {
            await signOut({ callbackUrl: "/login", redirect: true });
            toast.success("Logged out successfully!");
        } catch (error) {
            toast.error("Logout failed. Please try again.");
        }
    };
    return (
        <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
            Logout
        </button>
    );
}
