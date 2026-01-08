"use client";

import { useState } from "react";
import Image from "next/image";
import { useChorus } from "@/lib/chorus-context";
import { usePageBanner } from "@/hooks/usePageBanner";
import PageTransition from "@/components/ui/PageTransition";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

export default function ContactPage() {
  const { chorus } = useChorus();
  const bannerImage = usePageBanner("contact");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          chorus, // Include current chorus selection
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitResult({ success: true, message: data.message });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitResult({
          success: false,
          message: data.error || "Failed to send message",
        });
      }
    } catch {
      setSubmitResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chorus-specific content
  const chorusInfo = {
    harmony: {
      name: "Parkside Harmony",
    },
    melody: {
      name: "Parkside Melody",
    },
    voices: {
      name: "Parkside",
    },
  };

  const currentInfo = chorusInfo[chorus];

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative h-[200px] sm:h-[250px] md:h-[300px] bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src={bannerImage}
            alt={`Contact ${currentInfo.name}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-white/90 max-w-2xl">
            {chorus === "voices"
              ? "Get in touch with Parkside Barbershop. Join our chorus, book a performance, or just say hello!"
              : `Get in touch with ${currentInfo.name}. We'd love to hear from you!`}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <ScrollAnimation direction="right">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Send Us a Message
                </h2>

                {submitResult && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      submitResult.success
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {submitResult.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Please select a subject</option>
                      <option value="join">I&apos;m interested in joining</option>
                      <option value="performance">Book a performance</option>
                      <option value="lessons">Vocal coaching/lessons</option>
                      <option value="general">General inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              </div>
            </ScrollAnimation>

            {/* Contact Information */}
            <ScrollAnimation direction="left" delay={0.2}>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Contact Information
                </h2>

                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="h-6 w-6 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Rehearsal Location
                      </h3>
                      <p className="mt-1 text-gray-600">
                        Christ Presbyterian Church
                        <br />
                        421 Deerfield Road
                        <br />
                        Camp Hill, PA 17011
                      </p>
                      <p className="mt-2 text-gray-600">
                        Visitors and prospective members are always welcome!
                      </p>
                      <p className="mt-1 text-sm text-gray-500 italic">
                        *Unless otherwise noted in the rehearsal event
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="h-6 w-6 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Email Us
                      </h3>
                      <p className="mt-1 text-gray-600">
                        <a
                          href="mailto:info@parksideharmony.org"
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          info@parksideharmony.org
                        </a>
                      </p>
                      <p className="mt-1 text-gray-600">
                        We aim to respond to all inquiries within 24-48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Join Our Chorus
            </h2>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <ScrollAnimation delay={0.1}>
              <div className="relative h-[200px] sm:h-[250px] md:h-[300px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/harmony-bg.jpg"
                  alt={`Join ${currentInfo.name}`}
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.2}>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Experience the Joy of Harmony
                </h3>
                <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                  Whether you&apos;re an experienced singer or just love to sing
                  in the shower, there&apos;s a place for you in our chorus.
                  Join us for a rehearsal and discover the magic of barbershop
                  harmony!
                </p>
                <a
                  href="/join"
                  className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                >
                  Learn About Membership →
                </a>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
