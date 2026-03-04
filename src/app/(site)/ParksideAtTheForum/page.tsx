"use client";

import PageTransition from "@/components/ui/PageTransition";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";

// ─── Typography ────────────────────────────────────────────────────────────────
// Loaded via Google Fonts CSS at runtime (next/font/google requires build-time
// network access which isn't always available). The fonts are loaded in a
// useEffect and applied via CSS custom properties.
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Montserrat:wght@300;400;500;600&display=swap";

function useGoogleFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_URL}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);
}

// ─── Design tokens ─────────────────────────────────────────────────────────────
const colors = {
  bg: "#0c0c18",
  bgAlt: "#0f0f1f",
  gold: "#c9a862",
  goldMuted: "#a89860",
  cream: "#f0ebe0",
  body: "#c0b898",
  muted: "#7a7260",
  divider: "rgba(201,168,98,0.5)",
};

// ─── Reusable decorative divider with diamond ──────────────────────────────────
function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div
        className="h-px w-16 sm:w-24"
        style={{
          background: `linear-gradient(to right, transparent, ${colors.divider})`,
        }}
      />
      <div
        className="w-2 h-2 rotate-45"
        style={{ backgroundColor: colors.gold }}
      />
      <div
        className="h-px w-16 sm:w-24"
        style={{
          background: `linear-gradient(to left, transparent, ${colors.divider})`,
        }}
      />
    </div>
  );
}

// ─── Animated scroll-down chevron ──────────────────────────────────────────────
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={colors.goldMuted}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-60"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Page Component
// ═══════════════════════════════════════════════════════════════════════════════
export default function ParksideAtTheForumPage() {
  useGoogleFonts();

  return (
    <PageTransition>
      <div style={{ backgroundColor: colors.bg }}>
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
          {/* Background image with slow zoom */}
          <div className="absolute inset-0 animate-subtle-zoom">
            <Image
              src="/images/events/forum-interior.png"
              alt="The Forum Auditorium interior — constellation ceiling, grand stage, and historic seating"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>

          {/* Gradient overlay: transparent top → dark bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(12,12,24,0.1) 0%, rgba(12,12,24,0.4) 40%, rgba(12,12,24,0.85) 70%, rgba(12,12,24,1) 100%)",
            }}
          />

          {/* Hero content — centered with offset toward lower half */}
          <div className="relative z-10 flex flex-col items-center text-center px-4 pt-32 sm:pt-40 pb-24 sm:pb-32 mt-16 sm:mt-24">
            {/* Parkside Voices logo */}
            <Image
              src="/images/events/parkside-voices-logo-gold.png"
              alt="Parkside Voices"
              width={180}
              height={120}
              className="h-[100px] sm:h-[120px] md:h-[145px] w-auto mb-4"
            />

            {/* "Presents" */}
            <p
              className="font-['Montserrat',sans-serif] text-sm sm:text-base tracking-[0.3em] uppercase mb-4"
              style={{ color: colors.gold }}
            >
              Presents
            </p>

            <GoldDivider className="mb-6" />

            {/* Event title */}
            <h1
              className="font-['Cormorant_Garamond',serif]"
              style={{
                color: colors.cream,
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              <span className="block text-4xl sm:text-5xl md:text-6xl italic font-light">
                An Afternoon
              </span>
              <span
                className="block text-xl sm:text-2xl md:text-3xl font-light mt-1"
                style={{ color: colors.goldMuted, opacity: 0.7 }}
              >
                at
              </span>
              <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium mt-1">
                The Forum
              </span>
            </h1>

            <GoldDivider className="mt-6 mb-6" />

            {/* Date & time */}
            <p
              className="font-['Montserrat',sans-serif] text-base sm:text-lg font-semibold tracking-[0.25em] uppercase"
              style={{ color: colors.gold }}
            >
              June 13, 2026
            </p>
            <p
              className="font-['Montserrat',sans-serif] text-xs sm:text-sm tracking-[0.2em] uppercase mt-2"
              style={{ color: colors.goldMuted }}
            >
              Saturday &middot; 3:00 PM
            </p>
          </div>

          <ScrollIndicator />
        </section>

        {/* ── ABOUT THE EVENT ──────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 md:py-24" style={{ backgroundColor: colors.bg }}>
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-3xl mx-auto text-center">
                <h2
                  className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl md:text-5xl font-medium mb-8"
                  style={{
                    color: colors.cream,
                    textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  The Concert
                </h2>

                <p
                  className="font-['Montserrat',sans-serif] text-base sm:text-lg leading-relaxed mb-12"
                  style={{ color: colors.body }}
                >
                  Join Parkside Harmony and Parkside Melody for a special
                  afternoon of barbershop a cappella at one of central
                  Pennsylvania&apos;s most stunning venues. The historic Forum
                  Auditorium features breathtaking hand-painted murals and a
                  constellation ceiling — the perfect setting for an
                  unforgettable concert.
                </p>

                {/* Featuring logos */}
                <p
                  className="font-['Montserrat',sans-serif] text-xs tracking-[0.3em] uppercase mb-6"
                  style={{ color: colors.goldMuted }}
                >
                  Featuring
                </p>

                <div className="flex items-center justify-center gap-6 sm:gap-10">
                  <Image
                    src="/images/events/parkside-harmony-logo.png"
                    alt="Parkside Harmony"
                    width={140}
                    height={90}
                    className="h-[50px] sm:h-[60px] md:h-[70px] w-auto"
                  />
                  <div
                    className="w-1.5 h-1.5 rotate-45 shrink-0"
                    style={{ backgroundColor: colors.gold }}
                  />
                  <Image
                    src="/images/events/parkside-melody-logo.png"
                    alt="Parkside Melody"
                    width={140}
                    height={90}
                    className="h-[50px] sm:h-[60px] md:h-[70px] w-auto"
                  />
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* ── VENUE ────────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 md:py-24" style={{ backgroundColor: colors.bgAlt }}>
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-5xl mx-auto">
                <h2
                  className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl md:text-5xl font-medium text-center mb-4"
                  style={{
                    color: colors.cream,
                    textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  The Venue
                </h2>

                <p
                  className="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl md:text-3xl text-center mb-2"
                  style={{ color: colors.gold }}
                >
                  The Forum Auditorium
                </p>

                <p
                  className="font-['Montserrat',sans-serif] text-sm text-center mb-12"
                  style={{ color: colors.muted }}
                >
                  500 Walnut Street, Harrisburg, PA 17101
                </p>

                <GoldDivider className="mb-12" />

                {/* Venue details — two columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                  {/* Left: History */}
                  <div>
                    <h3
                      className="font-['Montserrat',sans-serif] text-xs tracking-[0.3em] uppercase mb-4"
                      style={{ color: colors.goldMuted }}
                    >
                      About the Venue
                    </h3>
                    <p
                      className="font-['Montserrat',sans-serif] text-sm sm:text-base leading-relaxed"
                      style={{ color: colors.body }}
                    >
                      Built in 1931, The Forum features 22 bronze doors by
                      sculptor Lee Lawrie, hand-painted ceiling murals depicting
                      over 1,000 stars and zodiac constellations, and eight
                      varieties of marble from around the world.
                    </p>
                    <p
                      className="font-['Montserrat',sans-serif] text-sm sm:text-base leading-relaxed mt-4"
                      style={{ color: colors.body }}
                    >
                      Capacity: 1,610 seats
                    </p>
                  </div>

                  {/* Right: Parking */}
                  <div>
                    <h3
                      className="font-['Montserrat',sans-serif] text-xs tracking-[0.3em] uppercase mb-4"
                      style={{ color: colors.goldMuted }}
                    >
                      Parking
                    </h3>
                    <p
                      className="font-['Montserrat',sans-serif] text-sm sm:text-base leading-relaxed"
                      style={{ color: colors.body }}
                    >
                      The Commonwealth Parking Garage is located directly across
                      the street. Street parking is also available on Walnut
                      Street and Commonwealth Avenue.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* ── TICKETS ──────────────────────────────────────────────────────── */}
        <section
          id="tickets"
          className="py-16 sm:py-20 md:py-24"
          style={{ backgroundColor: colors.bg }}
        >
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-2xl mx-auto text-center">
                <h2
                  className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl md:text-5xl font-medium mb-8"
                  style={{
                    color: colors.cream,
                    textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  Tickets &amp; Information
                </h2>

                <p
                  className="font-['Montserrat',sans-serif] text-base sm:text-lg leading-relaxed mb-10"
                  style={{ color: colors.body }}
                >
                  Ticket information coming soon. Check back for details on
                  pricing and availability.
                </p>

                {/* CTA button — gold outline */}
                <a
                  href="#tickets"
                  className="inline-block font-['Montserrat',sans-serif] text-sm sm:text-base font-semibold tracking-[0.15em] uppercase px-10 py-4 rounded-full border-2 transition-all duration-300 hover:shadow-lg"
                  style={{
                    color: colors.gold,
                    borderColor: colors.gold,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.gold;
                    e.currentTarget.style.color = colors.bg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = colors.gold;
                  }}
                >
                  Get Tickets
                </a>

                <GoldDivider className="mt-12 mb-8" />

                {/* Back to main site */}
                <Link
                  href="/home"
                  className="font-['Montserrat',sans-serif] text-sm transition-colors duration-200"
                  style={{ color: colors.muted }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.gold;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.muted;
                  }}
                >
                  &larr; Back to Parkside Voices
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
