import { getImages } from "@/lib/admin-data";
import Link from "next/link";
import { Plus } from "lucide-react";
import SeedImagesButton from "@/components/admin/SeedImagesButton";
import ImageGrid from "@/components/admin/ImageGrid";

const categoryLabels: Record<string, string> = {
  slideshow: "Home Slideshow",
  hero: "Hero Banners",
  banner: "Page Banners",
  progression: "Progression Gallery",
  other: "Other Images",
};

export default async function AdminImagesPage() {
  const images = await getImages();

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
        <ImageGrid images={images} categoryLabels={categoryLabels} />
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
