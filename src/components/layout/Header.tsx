"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useChorus } from "@/contexts/ChorusContext";
import chorusContent from "@/data/chorusContent";

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
  const [chorusDropdownOpen, setChorusDropdownOpen] = useState(false);
  const menuItemRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const chorusDropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { selectedChorus, setChorus } = useChorus();

  const handleMouseEnter = (itemName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveSubmenu(itemName);
  };

  const handleChorusDropdownToggle = () => {
    setChorusDropdownOpen(!chorusDropdownOpen);
  };

  const handleChorusSelect = (chorus: 'harmony' | 'melody' | null) => {
    setChorus(chorus);
    setChorusDropdownOpen(false);
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
    
    // Close the chorus dropdown when clicking outside
    const handleOutsideClick = (e: MouseEvent) => {
      if (chorusDropdownRef.current && !chorusDropdownRef.current.contains(e.target as Node)) {
        setChorusDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleOutsideClick);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Determine which logo to display based on selected chorus
  const getLogo = () => {
    if (selectedChorus === 'harmony') {
      return "/images/parkside-harmony-logo.png";
    } else if (selectedChorus === 'melody') {
      return "/images/parkside-melody-logo.png";
    } else {
      return "/images/parkside-logo.png";
    }
  };

  // Get chorus display name
  const getChorusName = () => {
    if (selectedChorus === 'harmony') {
      return chorusContent.harmony.fullName;
    } else if (selectedChorus === 'melody') {
      return chorusContent.melody.fullName;
    } else {
      return "Parkside";
    }
  };

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
                  src={getLogo()}
                  alt={`${getChorusName()} Logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">{getChorusName()}</span>
            </Link>
            <div className="hidden sm:block text-xs text-gray-500">
              <div>Hershey Chapter</div>
              <div>Barbershop Harmony Society</div>
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
            
            {/* Chorus Selector Dropdown */}
            <div className="relative" ref={chorusDropdownRef}>
              <button
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors py-2 flex items-center"
                onClick={handleChorusDropdownToggle}
              >
                {selectedChorus ? `Switch Chorus` : 'Choose Chorus'}
                <svg
                  className={`w-4 h-4 ml-1 transform transition-transform ${chorusDropdownOpen ? 'rotate-180' : ''}`}
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
              </button>
              <AnimatePresence>
                {chorusDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-0 w-48 bg-white rounded-md shadow-lg py-2 z-50"
                  >
                    <div className="absolute h-2 w-full -top-2 bg-transparent" />
                    
                    <button
                      onClick={() => handleChorusSelect(null)}
                      className={`w-full text-left block px-4 py-2 hover:bg-gray-50 ${selectedChorus === null ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}
                    >
                      <div className="flex items-center">
                        <div className="relative h-6 w-6 mr-2">
                          <Image
                            src="/images/parkside-logo.png"
                            alt="Parkside Logo"
                            fill
                            className="object-contain"
                          />
                        </div>
                        Both Choruses
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleChorusSelect('harmony')}
                      className={`flex items-center ${selectedChorus === 'harmony' ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}
                    >
                      <div className="relative h-6 w-6 mr-2">
                        <Image
                          src="/images/parkside-harmony-logo.png"
                          alt="Harmony Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      Parkside Harmony
                    </button>
                    
                    <button
                      onClick={() => handleChorusSelect('melody')}
                      className={`flex items-center ${selectedChorus === 'melody' ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}
                    >
                      <div className="relative h-6 w-6 mr-2">
                        <Image
                          src="/images/parkside-melody-logo.png"
                          alt="Melody Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      Parkside Melody
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              <div className="space-y-2">
                <div className="font-medium text-indigo-600">Choose Chorus:</div>
                <div className="ml-4 space-y-2">
                  <button
                    onClick={() => { handleChorusSelect(null); setMobileMenuOpen(false); }}
                    className={`flex items-center ${selectedChorus === null ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}
                  >
                    <div className="relative h-6 w-6 mr-2">
                      <Image
                        src="/images/parkside-logo.png"
                        alt="Parkside Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    Both Choruses
                  </button>
                  
                  <button
                    onClick={() => { handleChorusSelect('harmony'); setMobileMenuOpen(false); }}
                    className={`flex items-center ${selectedChorus === 'harmony' ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}
                  >
                    <div className="relative h-6 w-6 mr-2">
                      <Image
                        src="/images/parkside-harmony-logo.png"
                        alt="Harmony Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    Parkside Harmony
                  </button>
                  
                  <button
                    onClick={() => { handleChorusSelect('melody'); setMobileMenuOpen(false); }}
                    className={`flex items-center ${selectedChorus === 'melody' ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}
                  >
                    <div className="relative h-6 w-6 mr-2">
                      <Image
                        src="/images/parkside-melody-logo.png"
                        alt="Melody Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    Parkside Melody
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
} 