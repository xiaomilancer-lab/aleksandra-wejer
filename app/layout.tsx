import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PublicSitePulseTracker from "./site-pulse/PublicSitePulseTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aleksandrawejer.pl"),
  title: "Aleksandra Wejer | Psycholog | Starogard Gdański",
  description:
  "Aleksandra Wejer – psycholog w Starogardzie Gdańskim. Pomoc psychologiczna dla dzieci, młodzieży, dorosłych, par i rodzin. Konsultacje stacjonarne oraz online.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    title: "Aleksandra Wejer | Psycholog | Starogard Gdański",
    description: "Aleksandra Wejer – psycholog w Starogardzie Gdańskim. Pomoc psychologiczna dla dzieci, młodzieży, dorosłych, par i rodzin. Konsultacje stacjonarne oraz online.",
  },
  twitter: {
    card: "summary",
    title: "Aleksandra Wejer | Psycholog | Starogard Gdański",
    description: "Aleksandra Wejer – psycholog w Starogardzie Gdańskim. Pomoc psychologiczna dla dzieci, młodzieży, dorosłych, par i rodzin. Konsultacje stacjonarne oraz online.",
  },

    verification: {
    google: "kLEduvFtYgx4dlLGe1VlMiF9U7yNxqWnhg-cQy92ZHg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  {children}
  <PublicSitePulseTracker />
  <Analytics />
</body>
    </html>
  );
}
