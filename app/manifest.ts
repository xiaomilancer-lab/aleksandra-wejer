import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "PsychOLKA — Aleksandra Wejer",
    short_name: "PsychOLKA",
    description:
      "Prywatny pokój pacjenta, wizyty, wiadomości od Aleksandry i bezpieczny Babyroom.",
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
        name: "Mój pokój",
        short_name: "Pokój",
        description: "Przejdź do prywatnego pokoju PsychOLKI",
        url: "/room",
        icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Umów wizytę",
        short_name: "Wizyta",
        description: "Sprawdź dostępne terminy",
        url: "/#booking",
        icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
