import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel/", "/login", "/review/", "/parent/"],
    },
    sitemap: "https://aleksandrawejer.pl/sitemap.xml",
  };
}
