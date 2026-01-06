import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAdminUsers, addAdminUser } from "@/lib/admin-data";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await getAdminUsers();
  return NextResponse.json({ success: true, data: users });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, role } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const user = await addAdminUser(
      email,
      session.user.email || undefined,
      role || "admin"
    );

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Error adding admin user:", error);
    return NextResponse.json(
      { error: "Failed to add admin user" },
      { status: 500 }
    );
  }
}
