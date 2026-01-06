import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getVideos, createVideo } from "@/lib/admin-data";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const videos = await getVideos();
  return NextResponse.json({ success: true, data: videos });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      youtubeId,
      title,
      description,
      year,
      chorus,
      competition,
      placement,
      thumbnailUrl,
    } = body;

    if (!youtubeId || !title || !description || !year || !chorus) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const video = await createVideo({
      youtubeId,
      title,
      description,
      year,
      chorus,
      competition: competition || undefined,
      placement: placement || undefined,
      thumbnailUrl: thumbnailUrl || undefined,
      createdBy: session.user.email || undefined,
    });

    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
