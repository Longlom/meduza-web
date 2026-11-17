import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Meduza — Cocktails & Cuisine",
    short_name: "Meduza",
    description: "Cocktails & cuisine in Nha Trang. Menu, table booking and how to find us.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    // Abyss page ground (--mz-bg); the manifest cannot use CSS variables.
    background_color: "#05070E",
    theme_color: "#05070E",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
