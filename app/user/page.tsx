import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UserHome from "@/app/components/user/UserHome";

export default async function UserDashboard() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "USER") {
        redirect("/login");
    }
    return (
        <main className="p-10 text-center">
            <h1 className="text-2xl font-bold mb-4">👤 User Dashboard</h1>
            <UserHome user={session.user} />
        </main>
    );
}
