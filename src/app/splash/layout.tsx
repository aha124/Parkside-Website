// import { Inter } from "next/font/google"; // Removed as unused
// import { ThemeProvider } from "@/lib/ThemeProvider"; // Removed as unused
// import ErrorBoundary from "@/components/shared/ErrorBoundary"; // Removed as unused

// const inter = Inter({ subsets: ["latin"] }); // Removed as unused

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