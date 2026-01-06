import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getNews, createNews } from "@/lib/admin-data";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const news = await getNews();
  return NextResponse.json({ success: true, data: news });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, date, summary, content, imageUrl } = body;

    if (!title || !date || !summary) {
      return NextResponse.json(
        { error: "Title, date, and summary are required" },
        { status: 400 }
      );
    }

    const newsItem = await createNews({
      title,
      date,
      summary,
      content: content || "",
      imageUrl: imageUrl || "",
      createdBy: session.user.email || undefined,
    });

    return NextResponse.json({ success: true, data: newsItem });
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Failed to create news article" },
      { status: 500 }
    );
  }
}
