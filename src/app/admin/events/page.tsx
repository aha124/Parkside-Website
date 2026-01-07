import { getEventOverrides } from "@/lib/admin-data";
import Link from "next/link";
import { Plus, Edit, Eye, EyeOff, Calendar } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";
import SyncEventsButton from "@/components/admin/SyncEventsButton";
import fs from "fs";
import path from "path";

async function getScrapedEvents() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "events.json");
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export default async function AdminEventsPage() {
  const [overrides, scrapedEvents] = await Promise.all([
    getEventOverrides(),
    getScrapedEvents(),
  ]);

  // Build a map of hidden event IDs
  const hiddenIds = new Set(
    overrides.filter((o) => o.isHidden).map((o) => o.originalId)
  );

  // Build a map of override IDs
  const overrideMap = new Map(
    overrides.filter((o) => o.originalId && !o.isHidden).map((o) => [o.originalId, o])
  );

  // Manual events (no originalId)
  const manualEvents = overrides.filter((o) => !o.originalId && !o.isHidden);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">
            Manage events - scraped automatically with manual overrides
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SyncEventsButton />
          <Link
            href="/admin/events/new"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Event</span>
          </Link>
        </div>
      </div>

      {/* Manual Events Section */}
      {manualEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
            <h2 className="font-semibold text-indigo-900">Manual Events</h2>
            <p className="text-sm text-indigo-700">
              Events added manually through the admin dashboard
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {manualEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {event.date} {event.startTime && `at ${event.startTime}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <DeleteButton
                    id={event.id}
                    type="events"
                    title={event.title}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scraped Events Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Scraped Events</h2>
          <p className="text-sm text-gray-600">
            Automatically fetched from parksideharmony.org
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Event
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Chorus
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {scrapedEvents.map((event: { id: string; title: string; date: string; startTime?: string; chorus: string }) => {
                const isHidden = hiddenIds.has(event.id);
                const hasOverride = overrideMap.has(event.id);

                return (
                  <tr
                    key={event.id}
                    className={`hover:bg-gray-50 ${isHidden ? "opacity-50" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{event.title}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {event.date} {event.startTime && `at ${event.startTime}`}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          event.chorus === "Harmony"
                            ? "bg-indigo-100 text-indigo-700"
                            : event.chorus === "Melody"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {event.chorus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isHidden ? (
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <EyeOff className="w-4 h-4" />
                          Hidden
                        </span>
                      ) : hasOverride ? (
                        <span className="flex items-center gap-1 text-sm text-amber-600">
                          <Edit className="w-4 h-4" />
                          Modified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-green-600">
                          <Eye className="w-4 h-4" />
                          Visible
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/events/scraped/${event.id}/edit`}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit/Override"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/events/scraped/${event.id}/toggle-visibility`}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title={isHidden ? "Show" : "Hide"}
                        >
                          {isHidden ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
