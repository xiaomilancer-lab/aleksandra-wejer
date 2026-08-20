/* PsychOLKA PWA: cache contains only public assets. Never cache patient or panel data. */
const CACHE_PREFIX = "psycholka-public-";
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const PUBLIC_ASSETS = [
  "/offline",
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-maskable-512.png",
  "/psycholka/system/6_sleep_spi.png",
  "/psycholka/greeting/1_greeting_macha.png",
  "/psycholka/coloring/psycholka-waving-line-art.png",
  "/psycholka/coloring/psycholka-teddy-line-art.png",
  "/psycholka/coloring/psycholka-idea-line-art.png",
  "/psycholka/coloring/psycholka-hearts-line-art.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PUBLIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isSensitivePath(pathname) {
  return (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/panel") ||
    pathname.startsWith("/room") ||
    pathname.startsWith("/parent") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/review")
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cachedOffline = await caches.match("/offline");
        return cachedOffline || Response.error();
      }),
    );
    return;
  }

  if (isSensitivePath(url.pathname)) return;

  const isPublicAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/pwa/") ||
    url.pathname.startsWith("/psycholka/") ||
    url.pathname.startsWith("/images/");

  if (!isPublicAsset) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response.ok || response.type !== "basic") return response;
        const copy = response.clone();
        void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    }),
  );
});

self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const requestedUrl = typeof data.url === "string" ? data.url : "";
  const safeUrl = requestedUrl.startsWith("/") && !requestedUrl.startsWith("//") ? requestedUrl : "/room";
  event.waitUntil(
    self.registration.showNotification(data.title || "PsychOLKA", {
      body: data.body || "Masz nową wiadomość.",
      icon: "/pwa/icon-192.png",
      badge: "/pwa/icon-192.png",
      data: { url: safeUrl },
      tag: data.tag || "psycholka-message",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const requestedUrl = event.notification.data?.url;
  const targetUrl =
    typeof requestedUrl === "string" && requestedUrl.startsWith("/") && !requestedUrl.startsWith("//")
      ? requestedUrl
      : "/room";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => new URL(client.url).pathname === targetUrl);
      if (existing) return existing.focus();
      return self.clients.openWindow(targetUrl);
    }),
  );
});
