import SplitScreen from "@/components/splash/SplitScreen";
import PageTransition from "@/components/ui/PageTransition";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parkside Barbershop Harmony Society",
  description: "The Hershey Chapter of the Barbershop Harmony Society - featuring Parkside Harmony and Parkside Melody a cappella choruses.",
};

export default function SplashPage() {
  return (
    <PageTransition>
      <SplitScreen />
    </PageTransition>
  );
} 