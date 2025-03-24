import { Inter } from "next/font/google";
import { ThemeProvider } from "@/lib/ThemeProvider";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export default function SplashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      {children}
    </main>
  );
} 