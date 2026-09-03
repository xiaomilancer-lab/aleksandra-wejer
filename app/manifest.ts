import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "PsychOLKA — Aleksandra Wejer",
    short_name: "PsychOLKA",
    description:
      "Strona Aleksandry Wejer, panel pracy psychologa i bezpieczny Babyroom PsychOLKI.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#F8F5F0",
    theme_color: "#2D4739",
    categories: ["health", "lifestyle", "education"],
    lang: "pl-PL",
    icons: [
      {
        src: "/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Panel Aleksandry",
        short_name: "Panel",
        description: "Przejdź do panelu pracy psychologa",
        url: "/panel",
        icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Umów wizytę",
        short_name: "Wizyta",
        description: "Sprawdź dostępne terminy",
        url: "/#booking",
        icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Chwila z PsychOLKĄ",
        short_name: "Chwila",
        description: "Spokojna minuta działająca również bez internetu",
        url: "/chwila?source=pwa-shortcut",
        icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Babyroom",
        short_name: "Babyroom",
        description: "Bezpieczne aktywności i mini-gry bez reklam",
        url: "/babyroom?source=pwa-shortcut",
        icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Dojazd",
        short_name: "Dojazd",
        description: "Zaplanuj trasę do gabinetu",
        url: "/dojazd?source=pwa-shortcut",
        icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
