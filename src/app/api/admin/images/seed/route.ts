import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { seedExistingImages } from "@/lib/admin-data";

export async function POST() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await seedExistingImages(session.user.email || undefined);
    return NextResponse.json({
      success: true,
      message: `Added ${result.added} images, skipped ${result.skipped} already existing`,
      data: result,
    });
  } catch (error) {
    console.error("Error seeding images:", error);
    return NextResponse.json(
      { error: "Failed to seed images" },
      { status: 500 }
    );
  }
}
