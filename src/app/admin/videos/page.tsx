import { getVideos } from "@/lib/admin-data";
import Link from "next/link";
import { Plus, Edit, ExternalLink } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminVideosPage() {
  const videos = await getVideos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
          <p className="text-gray-600 mt-1">
            Manage YouTube videos in the media gallery
          </p>
        </div>
        <Link
          href="/admin/videos/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Video</span>
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No videos added yet</p>
          <Link
            href="/admin/videos/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Video</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="aspect-video relative bg-gray-100">
                <img
                  src={
                    video.thumbnailUrl ||
                    `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
                  }
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </a>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      video.chorus === "harmony"
                        ? "bg-indigo-100 text-indigo-700"
                        : video.chorus === "melody"
                        ? "bg-pink-100 text-pink-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {video.chorus === "voices"
                      ? "Combined"
                      : video.chorus.charAt(0).toUpperCase() +
                        video.chorus.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">{video.year}</span>
                  {video.placement && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                      {video.placement}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View on YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <Link
                    href={`/admin/videos/${video.id}/edit`}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <DeleteButton
                    id={video.id}
                    type="videos"
                    title={video.title}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
