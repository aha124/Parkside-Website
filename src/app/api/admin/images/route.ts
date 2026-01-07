import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getImages } from "@/lib/admin-data";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const images = await getImages();
    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
