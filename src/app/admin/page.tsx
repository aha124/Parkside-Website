import { getNews } from "@/lib/admin-data";
import { getEventOverrides, getVideos, getImages } from "@/lib/admin-data";
import { Newspaper, Calendar, Video, Image, ArrowRight } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const [news, eventOverrides, videos, images] = await Promise.all([
    getNews(),
    getEventOverrides(),
    getVideos(),
    getImages(),
  ]);

  return {
    newsCount: news.length,
    eventOverridesCount: eventOverrides.length,
    videosCount: videos.length,
    imagesCount: images.length,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      title: "News Articles",
      count: stats.newsCount,
      icon: Newspaper,
      href: "/admin/news",
      color: "bg-blue-500",
      description: "Manage news and announcements",
    },
    {
      title: "Event Overrides",
      count: stats.eventOverridesCount,
      icon: Calendar,
      href: "/admin/events",
      color: "bg-green-500",
      description: "Manual event additions and edits",
    },
    {
      title: "Videos",
      count: stats.videosCount,
      icon: Video,
      href: "/admin/videos",
      color: "bg-purple-500",
      description: "Manage video gallery",
    },
    {
      title: "Images",
      count: stats.imagesCount,
      icon: Image,
      href: "/admin/images",
      color: "bg-orange-500",
      description: "Manage site images and banners",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome to the Parkside admin dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  {card.count}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">{card.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{card.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/news/new"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-700">Create News Article</span>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link
              href="/admin/events/new"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-700">Add Manual Event</span>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link
              href="/admin/videos/new"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-700">Add Video</span>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link
              href="/admin/images/upload"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-700">Upload Image</span>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            About Events
          </h2>
          <div className="text-sm text-gray-600 space-y-3">
            <p>
              Events are automatically scraped from parksideharmony.org daily.
              You can:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li>Add manual events that don&apos;t appear on the main site</li>
              <li>Edit scraped events to correct information</li>
              <li>Hide events you don&apos;t want displayed</li>
            </ul>
            <p className="text-gray-500">
              Manual changes take priority over scraped data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
