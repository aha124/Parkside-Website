import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeProvider";
// import { defaultMetadata } from "@/lib/metadata"; // Removed as unused
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { ChorusProvider } from "@/contexts/ChorusContext";
import { StyleProvider } from "@/contexts/StyleContext";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    template: '%s | Parkside',
    default: 'Parkside - Hershey Chapter of the Barbershop Harmony Society'
  },
  description: 'Welcome to Parkside - home of Parkside Harmony and Parkside Melody a cappella choruses.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <ChorusProvider>
            <StyleProvider>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </StyleProvider>
          </ChorusProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
