import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PublicSitePulseTracker from "./site-pulse/PublicSitePulseTracker";
import PwaInstallPrompt from "./pwa/PwaInstallPrompt";
import PwaServiceWorker from "./pwa/PwaServiceWorker";
import { PUBLIC_PWA_PROMOTION_ENABLED } from "./lib/publicFeatures";

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
  applicationName: "PsychOLKA",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PsychOLKA",
  },
  formatDetection: {
    telephone: false,
  },
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
  viewportFit: "cover",
  themeColor: "#2D4739",
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
  {PUBLIC_PWA_PROMOTION_ENABLED ? <PwaInstallPrompt /> : null}
  <PwaServiceWorker />
  <PublicSitePulseTracker />
  <Analytics />
</body>
    </html>
  );
}
