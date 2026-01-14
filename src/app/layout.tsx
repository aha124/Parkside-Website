import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { ChorusProvider } from "@/lib/chorus-context";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { Analytics } from "@vercel/analytics/next";

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
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </ChorusProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
