import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: number }>;
  }
) {
  try {
    const { id } = await params;
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: +id } });

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
