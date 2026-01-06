import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchYouTubeMetadata } from "@/lib/admin-data";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const metadata = await fetchYouTubeMetadata(url);

    if (!metadata) {
      return NextResponse.json(
        { error: "Could not fetch video metadata. Please check the URL." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: metadata });
  } catch (error) {
    console.error("Error fetching YouTube metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch video metadata" },
      { status: 500 }
    );
  }
}
