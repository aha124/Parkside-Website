import { Metadata } from "next";

export const metadata: Metadata = {
  title: "An Afternoon at The Forum | Parkside Voices",
  description:
    "Parkside Harmony and Parkside Melody perform barbershop a cappella at the historic Forum Auditorium in Harrisburg, PA. Saturday, June 13, 2026 at 3:00 PM.",
  openGraph: {
    title: "An Afternoon at The Forum | Parkside Voices",
    description:
      "Parkside Harmony and Parkside Melody perform barbershop a cappella at the historic Forum Auditorium in Harrisburg, PA. Saturday, June 13, 2026 at 3:00 PM.",
    images: ["/images/events/forum-ad-landscape.png"],
  },
};

export default function ForumEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
