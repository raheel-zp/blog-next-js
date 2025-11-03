import AdminSidebar from "../components/admin/AdminSidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const session = await getServerSession(authOptions);

    // Redirect if not logged in
    if (!session) {
        redirect("/login");
    }

    // Redirect if user is not admin
    if (session.user.role !== "ADMIN") {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
