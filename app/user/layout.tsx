import UserSidebar from "../components/user/UserSidebar";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <UserSidebar />
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
