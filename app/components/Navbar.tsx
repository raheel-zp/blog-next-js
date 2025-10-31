'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function Navbar() {
    const { data: session } = useSession();

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
        toast.success('Logged out successfully!');
    };

    return (
        <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Blog Explorer</Link>

            <div className="space-x-4">
                {!session && (
                    <Link href="/login" className="hover:underline">Login</Link>
                )}

                {session && (
                    <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}
