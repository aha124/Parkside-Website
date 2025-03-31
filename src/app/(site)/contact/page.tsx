import { Metadata } from "next";
// import Image from "next/image"; // Removed as unused
// import Link from "next/link"; // Removed as unused
import PageTransition from "@/components/ui/PageTransition";
import ChorusHero from "@/components/ui/ChorusHero";
import ContactContent from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact Parkside Barbershop",
  description: "Get in touch with the Hershey Chapter of the Barbershop Harmony Society. Join our chorus or book a performance!",
};

export default function ContactPage() {
  return (
    <PageTransition>
      {/* Hero Section */}
      <ChorusHero
        page="contact"
        title="Contact Us"
        description="Join our chorus, book a performance, or just say hello to the Parkside Barbershop Harmony Society."
      />

      {/* Contact Content */}
      <ContactContent />
    </PageTransition>
  );
} 