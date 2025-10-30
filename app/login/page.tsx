'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            toast.error(res.error);
        } else {
            toast.success("Welcome back!");
            const sessionRes = await fetch("/api/auth/session");
            const session = await sessionRes.json();

            if (session?.user?.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/user/dashboard");
            }
        }
    };

    return (
        <main className="max-w-md mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full border p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
        </main>
    );
}
