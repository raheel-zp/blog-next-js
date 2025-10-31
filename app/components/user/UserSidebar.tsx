"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function UserSidebar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const role = session?.user?.role;

    const menuItems = {
        USER: [
            { label: "My Posts", href: "/user/dashboard" },
            { label: "Profile", href: "/user/profile" },
            { label: "Create Post", href: "/admin/new" },
        ]
    };

    const links = menuItems[role as keyof typeof menuItems] ?? [];

    return (
        <aside className="w-64 bg-gray-900 text-white h-screen p-4">
            <h2 className="text-lg font-semibold mb-6">User Panel</h2>
            <nav className="space-y-2">
                {links.map(({ label, href }) => (
                    <Link
                        key={href}
                        href={href}
                        className={clsx(
                            "block rounded-lg px-3 py-2 transition-colors",
                            pathname === href
                                ? "bg-gray-700 text-white"
                                : "text-gray-300 hover:bg-gray-800"
                        )}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
