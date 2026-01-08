"use client";

import Image from "next/image";
import { ImageIcon, ExternalLink } from "lucide-react";
import type { SiteSettings, ChorusKey, PageKey } from "@/types/admin";

const chorusInfo: Record<ChorusKey, { name: string; color: string; bgColor: string }> = {
  harmony: { name: "Harmony", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  melody: { name: "Melody", color: "text-amber-700", bgColor: "bg-amber-100" },
  voices: { name: "Voices", color: "text-purple-700", bgColor: "bg-purple-100" },
};

const choruses: ChorusKey[] = ["harmony", "melody", "voices"];

// Store configuration
const stores = [
  {
    id: "etown" as const,
    name: "eTown Sporting Goods",
    description: "Official Parkside apparel including polos, jackets, and performance wear",
    url: "https://etownsportinggoods.chipply.com/ParksideHarmony/?apid=21339117",
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
  },
  {
    id: "cafepress" as const,
    name: "CafePress",
    description: "T-shirts, mugs, stickers, and fun Parkside merchandise",
    url: "https://www.cafepress.com/shop/ParksideGear",
    color: "bg-orange-600",
    hoverColor: "hover:bg-orange-700",
  },
];

type StoreId = "etown" | "cafepress";

interface GearTabProps {
  settings: SiteSettings | null;
  onImageSelect: (type: "banner" | "gearStore", chorus: ChorusKey, page: PageKey, storeId?: StoreId) => void;
}

export default function GearTab({ settings, onImageSelect }: GearTabProps) {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Gear Page</h2>
        <p className="text-sm text-gray-500">
          Configure the gear page banner and store card images. The page displays two stores with flip card animations.
        </p>
      </div>

      {/* Banner Images Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Page Banner Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {choruses.map((chorus) => (
            <div key={chorus}>
              <label className={`block text-sm font-medium mb-2 ${chorusInfo[chorus].color}`}>
                {chorusInfo[chorus].name} Banner
              </label>
              <button
                onClick={() => onImageSelect("banner", chorus, "gear")}
                className={`w-full border-2 border-dashed rounded-lg p-2 text-center ${chorusInfo[chorus].bgColor} border-gray-300 hover:border-gray-400 hover:bg-opacity-70 transition-all cursor-pointer group`}
              >
                {settings?.pageBanners?.gear?.[chorus] ? (
                  <div className="relative h-20 w-full mb-1 rounded overflow-hidden">
                    <Image
                      src={settings.pageBanners.gear[chorus]!}
                      alt={`Gear ${chorusInfo[chorus].name} banner`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-20 w-full mb-1 bg-white/50 rounded flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <span className="text-xs text-gray-600 group-hover:text-gray-900">
                  {settings?.pageBanners?.gear?.[chorus] ? "Change" : "Select"}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Store Cards Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-md font-medium text-gray-900 mb-2">Store Card Images</h3>
        <p className="text-sm text-gray-500 mb-4">
          These images appear on the front of the flip cards. When users hover, the card flips to show the store details and a &quot;Shop Now&quot; button.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store) => (
            <div key={store.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-4">
                {/* Image picker */}
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {store.name}
                  </label>
                  <button
                    onClick={() => onImageSelect("gearStore", "voices", "gear", store.id)}
                    className="w-40 border-2 border-dashed rounded-lg p-2 text-center bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer group"
                  >
                    {settings?.gearStoreImages?.[store.id] ? (
                      <div className="relative h-28 w-full mb-1 rounded overflow-hidden">
                        <Image
                          src={settings.gearStoreImages[store.id]!}
                          alt={`${store.name} merchandise`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-28 w-full mb-1 bg-gray-100 rounded flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <span className="text-xs text-gray-600 group-hover:text-gray-900">
                      {settings?.gearStoreImages?.[store.id] ? "Change Image" : "Select Image"}
                    </span>
                  </button>
                </div>
                {/* Store info */}
                <div className="flex-grow">
                  <p className="text-sm text-gray-600 mb-3">{store.description}</p>
                  <a
                    href={store.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm text-white ${store.color} ${store.hoverColor} rounded-lg transition-colors`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Store
                  </a>
                  <p className="text-xs text-gray-400 mt-2 break-all">{store.url}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-1">How the Gear Page Works</h4>
        <p className="text-sm text-blue-700">
          The gear page displays two flip cards, one for each store. When visitors hover over a card,
          it flips to reveal the store name, description, and a &quot;Shop Now&quot; button that opens the
          external store in a new tab. The store URLs are fixed and cannot be changed here.
        </p>
      </div>
    </div>
  );
}
