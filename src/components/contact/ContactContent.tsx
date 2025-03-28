"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import { useChorus } from "@/contexts/ChorusContext";
import chorusContent from "@/data/chorusContent";

export default function ContactContent() {
  const { selectedChorus } = useChorus();
  
  const getContactInfo = () => {
    if (selectedChorus === 'harmony') {
      return {
        email: "manager@parksideharmony.org",
        phone: "(714) 271-4506",
        contactPerson: "Harmony Director"
      };
    } else if (selectedChorus === 'melody') {
      return {
        email: "melody@parksideharmony.org", 
        phone: "(714) 271-4506",
        contactPerson: "Melody Director"
      };
    } else {
      return {
        email: "manager@parksideharmony.org",
        phone: "(714) 271-4506",
        contactPerson: "Parkside Manager"
      };
    }
  };
  
  const contactInfo = getContactInfo();
  
  return (
    <>
      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ScrollAnimation direction="right">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first-name"
                        name="first-name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last-name"
                        name="last-name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Please select a subject</option>
                      <option value="join">I'm interested in joining</option>
                      <option value="performance">Book a performance</option>
                      <option value="lessons">Vocal coaching/lessons</option>
                      <option value="general">General inquiry</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </ScrollAnimation>
            
            {/* Contact Information */}
            <ScrollAnimation direction="left" delay={0.2}>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                      <p className="mt-1 text-gray-600">
                        <a href={`mailto:${contactInfo.email}`} className="text-indigo-600 hover:text-indigo-500">
                          {contactInfo.email}
                        </a>
                      </p>
                      <p className="mt-1 text-gray-600">
                        We aim to respond to all inquiries within 24-48 hours.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Call Us</h3>
                      <p className="mt-1 text-gray-600">
                        <a href={`tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`} className="text-indigo-600 hover:text-indigo-500">
                          {contactInfo.phone}
                        </a>
                      </p>
                      <p className="mt-1 text-gray-600">
                        For performance bookings or membership inquiries
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Rehearsal Schedule</h3>
                      <p className="mt-1 text-gray-600">
                        We typically meet biweekly on Mondays from 7:00 PM - 9:00 PM.
                      </p>
                      <p className="mt-2 text-gray-600">
                        <Link href="/events" className="text-indigo-600 hover:text-indigo-500">
                          Check our events page →
                        </Link>
                      </p>
                      <p className="mt-1 text-gray-600">
                        Visitors and prospective members are always welcome!
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-indigo-600">
                      <span className="sr-only">Facebook</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-indigo-600">
                      <span className="sr-only">YouTube</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {selectedChorus ? `Join Parkside ${selectedChorus.charAt(0).toUpperCase() + selectedChorus.slice(1)}` : "Join Our Choruses"}
            </h2>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ScrollAnimation delay={0.1}>
              <div className="relative h-[300px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={selectedChorus === 'harmony' ? "/images/harmony-performance.jpg" : 
                       selectedChorus === 'melody' ? "/images/melody-performance.jpg" : 
                       "/images/join-hero.jpg"}
                  alt={`Join Parkside ${selectedChorus ? selectedChorus.charAt(0).toUpperCase() + selectedChorus.slice(1) : ""}`}
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.2}>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Experience the Joy of Harmony</h3>
                <p className="text-lg text-gray-600 mb-6">
                  {selectedChorus === 'harmony' ? 
                    "Whether you're an experienced barbershopper or just love to sing, there's a place for you in Parkside Harmony. Join us to experience the magic of men's a cappella!" :
                  selectedChorus === 'melody' ? 
                    "Join Parkside Melody and become part of our vibrant treble voice community. All experience levels are welcome!" :
                    "Whether you're an experienced singer or just love to sing in the shower, there's a place for you in our choruses. Join us for a rehearsal and discover the magic of barbershop harmony!"}
                </p>
                <Link
                  href="/join"
                  className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Learn About Membership →
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </>
  );
} 