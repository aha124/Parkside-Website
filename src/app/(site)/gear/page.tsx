"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ShoppingBag } from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import HeroSection from "@/components/ui/HeroSection";
import { usePageBanner } from "@/hooks/usePageBanner";
import type { SiteSettings } from "@/types/admin";

// Store configuration - links are fixed
const stores = [
  {
    id: "etown" as const,
    name: "eTown Sporting Goods",
    description: "Official Parkside apparel including polos, jackets, and performance wear. Quality embroidered gear for rehearsals and performances.",
    url: "https://etownsportinggoods.chipply.com/ParksideHarmony/?apid=21339117",
    color: "from-blue-600 to-blue-800",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    defaultImage: "/images/placeholder-hero.jpg",
  },
  {
    id: "cafepress" as const,
    name: "CafePress",
    description: "T-shirts, mugs, stickers, and fun Parkside merchandise. Show your Parkside pride with casual wear and accessories.",
    url: "https://www.cafepress.com/shop/ParksideGear",
    color: "from-orange-500 to-orange-700",
    buttonColor: "bg-orange-600 hover:bg-orange-700",
    defaultImage: "/images/placeholder-hero.jpg",
  },
];

interface FlipCardProps {
  store: typeof stores[0];
  imageUrl: string;
}

function FlipCard({ store, imageUrl }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-[400px] sm:h-[450px] perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onTouchStart={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card - Product Image */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Store name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-white mb-2">{store.name}</h3>
            <p className="text-white/80 text-sm flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Hover to see details
            </p>
          </div>
        </div>

        {/* Back of card - Store Info */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br ${store.color}`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-6">
              <ShoppingBag className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {store.name}
            </h3>
            <p className="text-white/90 text-base sm:text-lg mb-8 max-w-sm">
              {store.description}
            </p>
            <a
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-8 py-4 ${store.buttonColor} text-white font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105`}
            >
              <span>Shop Now</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function GearPage() {
  const bannerImage = usePageBanner("gear");
  const [storeImages, setStoreImages] = useState<Record<string, string>>({
    etown: stores[0].defaultImage,
    cafepress: stores[1].defaultImage,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/admin/site-settings");
        const data = await response.json();
        if (data.success && data.data) {
          const settings = data.data as SiteSettings;
          if (settings.gearStoreImages) {
            setStoreImages({
              etown: settings.gearStoreImages.etown || stores[0].defaultImage,
              cafepress: settings.gearStoreImages.cafepress || stores[1].defaultImage,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching store images:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  return (
    <PageTransition>
      <div className="bg-white">
        <HeroSection
          title="Parkside Gear"
          subtitle="Show your Parkside pride with official merchandise"
          imagePath={bannerImage}
          imageAlt="Parkside Merchandise"
        />

        {/* Store Cards Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Shop Our Stores
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Choose from our official merchandise partners. Hover over a card to learn more and start shopping.
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {stores.map((store, index) => (
                <ScrollAnimation key={store.id} delay={index * 0.2}>
                  {!loading && (
                    <FlipCard
                      store={store}
                      imageUrl={storeImages[store.id]}
                    />
                  )}
                  {loading && (
                    <div className="w-full h-[400px] sm:h-[450px] rounded-2xl bg-gray-200 animate-pulse" />
                  )}
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  Questions About Merchandise?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Both stores are managed by external vendors. For questions about orders,
                  sizing, or shipping, please contact the respective store directly.
                  For general inquiries about Parkside merchandise, feel free to reach out to us.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors duration-200"
                >
                  Contact Us
                </a>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </div>

      {/* CSS for 3D perspective */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </PageTransition>
  );
}
