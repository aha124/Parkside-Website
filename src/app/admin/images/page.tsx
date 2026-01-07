import { getImages } from "@/lib/admin-data";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";
import CopyUrlButton from "@/components/admin/CopyUrlButton";
import SeedImagesButton from "@/components/admin/SeedImagesButton";

export default async function AdminImagesPage() {
  const images = await getImages();

  // Group images by category
  const groupedImages = images.reduce(
    (acc, img) => {
      const category = img.category || "other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(img);
      return acc;
    },
    {} as Record<string, typeof images>
  );

  const categoryLabels: Record<string, string> = {
    slideshow: "Home Slideshow",
    hero: "Hero Banners",
    banner: "Page Banners",
    progression: "Progression Gallery",
    other: "Other Images",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Images</h1>
          <p className="text-gray-600 mt-1">
            Manage site images, banners, and slideshows
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SeedImagesButton />
          <Link
            href="/admin/images/upload"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Upload Image</span>
          </Link>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No images uploaded yet</p>
          <Link
            href="/admin/images/upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Upload Your First Image</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(categoryLabels).map(([category, label]) => {
            const categoryImages = groupedImages[category] || [];
            if (categoryImages.length === 0) return null;

            return (
              <div
                key={category}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-900">{label}</h2>
                  <p className="text-sm text-gray-500">
                    {categoryImages.length} image
                    {categoryImages.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categoryImages.map((image) => (
                    <div
                      key={image.id}
                      className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-video"
                    >
                      <img
                        src={image.url}
                        alt={image.alt || image.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <CopyUrlButton url={image.url} />
                        <Link
                          href={`/admin/images/${image.id}/edit`}
                          className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteButton
                          id={image.id}
                          type="images"
                          title={image.name}
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white text-sm truncate">
                          {image.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          Using Images in Content
        </h3>
        <p className="text-blue-700 text-sm">
          After uploading an image, click the copy button to copy the URL. You
          can then paste this URL in news articles, events, or anywhere that
          accepts an image URL.
        </p>
      </div>
    </div>
  );
}
