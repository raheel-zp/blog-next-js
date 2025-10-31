import AdminSidebar from "../components/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
