import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/ui/HeroSection';
import ScrollAnimation from '@/components/ui/ScrollAnimation';

export default function GearPage() {
  return (
    <main className="min-h-screen">
      <HeroSection
        title="Parkside Gear"
        subtitle="Show your support with official merchandise"
        imagePath="/images/parkside-logo.png"
        imageAlt="Parkside Harmony Merchandise"
      />

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Official Merchandise</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Browse our collection of official Parkside Harmony gear. All proceeds support our mission of bringing harmony to our community.
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Etown Sporting Goods Store */}
            <ScrollAnimation>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="text-center">
                  <div className="mb-8">
                    <div className="w-24 h-24 mx-auto mb-6 relative">
                      <Image
                        src="/images/parkside-logo.png"
                        alt="Parkside Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">Etown Sporting Goods Store</h3>
                    <p className="text-gray-600 mb-6">
                      Our primary merchandise store featuring high-quality apparel and accessories. 
                      All items are custom-printed to order with our official logo.
                    </p>
                  </div>

                  <Link
                    href="https://etownsportinggoods.chipply.com/ParksideHarmony/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    <span className="mr-2">Shop Now</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>

                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h4 className="font-semibold">Premium Quality</h4>
                      <p className="text-sm text-gray-600">High-end materials</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold">Secure Shopping</h4>
                      <p className="text-sm text-gray-600">Safe checkout</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold">Direct Support</h4>
                      <p className="text-sm text-gray-600">Funds our programs</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* CafePress Store */}
            <ScrollAnimation>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="text-center">
                  <div className="mb-8">
                    <div className="w-24 h-24 mx-auto mb-6 relative">
                      <Image
                        src="/images/parkside-logo.png"
                        alt="Parkside Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">CafePress Store</h3>
                    <p className="text-gray-600 mb-6">
                      Additional merchandise options including unique designs and a wider variety of products. 
                      Perfect for finding that special Parkside gift.
                    </p>
                  </div>

                  <Link
                    href="https://www.cafepress.com/shop/ParksideGear"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    <span className="mr-2">Shop Now</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>

                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold">Unique Designs</h4>
                      <p className="text-sm text-gray-600">Special collections</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h4 className="font-semibold">More Options</h4>
                      <p className="text-sm text-gray-600">Wider selection</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold">Gift Ready</h4>
                      <p className="text-sm text-gray-600">Perfect presents</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </main>
  );
}
