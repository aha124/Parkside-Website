import { getFeaturedBanners } from "@/lib/admin-data";
import { getBannerStatus, selectActiveBanner } from "@/lib/banner-visibility";
import type { BannerStatus } from "@/lib/banner-visibility";
import Link from "next/link";
import { Plus, Edit, Image as ImageIcon } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

const STATUS_STYLES: Record<BannerStatus, string> = {
  live: "bg-green-100 text-green-800",
  scheduled: "bg-blue-100 text-blue-800",
  expired: "bg-gray-100 text-gray-600",
  off: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<BannerStatus, string> = {
  live: "Live",
  scheduled: "Scheduled",
  expired: "Finished",
  off: "Off",
};

function formatDate(value: string): string {
  // Parse as UTC so a "YYYY-MM-DD" string isn't shifted a day by local time.
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function describeSchedule(startDate?: string, endDate?: string): string {
  if (startDate && endDate) return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  if (startDate) return `From ${formatDate(startDate)}`;
  if (endDate) return `Until ${formatDate(endDate)}`;
  return "No end date";
}

export default async function AdminFeaturedBannersPage() {
  const banners = await getFeaturedBanners();
  // Only one banner renders publicly, even when several qualify as live.
  const showing = selectActiveBanner(banners);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Banners</h1>
          <p className="text-gray-600 mt-1">
            The promotional banner below the hero slideshow on the homepage
          </p>
        </div>
        <Link
          href="/admin/featured-banners/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Banner</span>
        </Link>
      </div>

      {banners.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No banners yet</p>
          <p className="text-gray-400 text-sm mb-6">
            Add a banner to promote an upcoming show at the top of the homepage.
            Give it an end date and it will take itself down afterwards.
          </p>
          <Link
            href="/admin/featured-banners/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Banner</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Banner
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {banners.map((banner) => {
                    const status = getBannerStatus(banner);
                    const isShowing = showing?.id === banner.id;
                    const title = [banner.leadIn, banner.headline]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <tr key={banner.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-10 rounded overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                              {banner.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={banner.imageUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {title}
                              </div>
                              {banner.subline && (
                                <div className="text-sm text-gray-500 truncate">
                                  {banner.subline}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-start gap-1">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_STYLES[status]}`}
                            >
                              {STATUS_LABELS[status]}
                            </span>
                            {isShowing && (
                              <span className="text-xs text-green-700">
                                On homepage now
                              </span>
                            )}
                            {status === "live" && !isShowing && (
                              <span className="text-xs text-gray-500">
                                Outranked
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {describeSchedule(banner.startDate, banner.endDate)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {banner.priority}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/featured-banners/${banner.id}/edit`}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <DeleteButton
                              id={banner.id}
                              type="featured-banners"
                              title={title}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Only one banner appears on the homepage at a time — the live one with
            the highest priority. Banners past their end date stop showing
            automatically.
          </p>
        </>
      )}
    </div>
  );
}
