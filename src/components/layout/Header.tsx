"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useChorus, ChorusType } from "@/lib/chorus-context";

// Default logo and name configuration for each chorus
const defaultChorusConfig = {
  harmony: {
    logo: "/images/parkside-logo.png",
    name: "Parkside Harmony",
    tagline: "Bass Clef Chorus",
  },
  melody: {
    logo: "/images/parkside-logo.png",
    name: "Parkside Melody",
    tagline: "Treble Clef Chorus",
  },
  voices: {
    logo: "/images/parkside-logo.png",
    name: "Parkside Voices",
    tagline: "Hershey Chapter - BHS",
  },
};

const navItems = [
  { name: "Home", href: "/home" },
  {
    name: "About",
    href: "/about",
    submenu: [
      { name: "About Us", href: "/about" },
      { name: "Leadership", href: "/about/leadership" },
    ],
  },
  { name: "Join", href: "/join" },
  { name: "Media", href: "/media" },
  { name: "Donate", href: "/donate" },
  { name: "Events", href: "/events" },
  { name: "Purchase Gear", href: "/gear" },
  { name: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [logos, setLogos] = useState<Record<ChorusType, string>>(
    { harmony: defaultChorusConfig.harmony.logo, melody: defaultChorusConfig.melody.logo, voices: defaultChorusConfig.voices.logo }
  );
  const menuItemRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { chorus } = useChorus();

  // Fetch logos from site settings
  useEffect(() => {
    async function fetchLogos() {
      try {
        const response = await fetch("/api/admin/site-settings");
        const data = await response.json();
        if (data.success && data.data?.logos) {
          setLogos({
            harmony: data.data.logos.harmony || defaultChorusConfig.harmony.logo,
            melody: data.data.logos.melody || defaultChorusConfig.melody.logo,
            voices: data.data.logos.voices || defaultChorusConfig.voices.logo,
          });
        }
      } catch (error) {
        console.error("Error fetching logos:", error);
      }
    }
    fetchLogos();
  }, []);

  const currentConfig = {
    logo: logos[chorus],
    name: defaultChorusConfig[chorus].name,
    tagline: defaultChorusConfig[chorus].tagline,
  };

  const handleMouseEnter = (itemName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveSubmenu(itemName);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!menuItemRef.current || !submenuRef.current) return;

    const menuRect = menuItemRef.current.getBoundingClientRect();
    const submenuRect = submenuRef.current.getBoundingClientRect();

    const isOverMenuItem = 
      e.clientX >= menuRect.left &&
      e.clientX <= menuRect.right &&
      e.clientY >= menuRect.top &&
      e.clientY <= menuRect.bottom;

    const isOverSubmenu =
      e.clientX >= submenuRect.left &&
      e.clientX <= submenuRect.right &&
      e.clientY >= submenuRect.top - 10 &&
      e.clientY <= submenuRect.bottom;

    if (!isOverMenuItem && !isOverSubmenu) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setActiveSubmenu(null);
      }, 100) as unknown as NodeJS.Timeout;
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/splash"
              className="flex items-center gap-2"
            >
              <div className="relative h-10 w-10">
                <Image
                  src={currentConfig.logo}
                  alt={`${currentConfig.name} Logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">{currentConfig.name}</span>
            </Link>
            <div className="hidden sm:block text-xs text-gray-500 ml-2">
              <div>{currentConfig.tagline}</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <div
                key={item.name}
                ref={item.submenu ? menuItemRef : undefined}
                className="relative"
                onMouseEnter={() => item.submenu && handleMouseEnter(item.name)}
              >
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors inline-flex items-center py-2"
                >
                  {item.name}
                  {item.submenu && (
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </Link>
                <AnimatePresence>
                  {item.submenu && activeSubmenu === item.name && (
                    <motion.div
                      ref={submenuRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full mt-0 w-48 bg-white rounded-md shadow-lg py-2 z-50"
                    >
                      <div className="absolute h-2 w-full -top-2 bg-transparent" />
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <Link
              href="/splash"
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Choose Chorus
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4"
          >
            <div className="flex flex-col space-y-4 pb-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    onClick={() => !item.submenu && setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block text-gray-500 hover:text-gray-900 font-medium transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/splash"
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Choose Chorus
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
} 