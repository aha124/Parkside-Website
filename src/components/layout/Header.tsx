"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", href: "/home" },
  { name: "About", href: "/about" },
  { name: "Join", href: "/join" },
  { name: "Media", href: "/media" },
  { name: "Donate", href: "/donate" },
  { name: "Events", href: "/events" },
  { name: "Purchase Gear", href: "/gear" },
  { name: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/splash" className="flex items-center mr-6" title="Return to Splash Page">
              <div className="relative h-14 w-14 mr-2">
                <Image
                  src="/images/parkside-logo.png"
                  alt="Parkside Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-gray-800">Parkside</span>
            </Link>
            <div className="hidden sm:block text-xs text-gray-500">
              <div>Hershey Chapter</div>
              <div>Barbershop Harmony Society</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {item.name}
              </Link>
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
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
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