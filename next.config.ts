import type { NextConfig } from "next";

// The design system lives in ./design-system and is imported as "@meduza/ui" through the
// tsconfig path alias, so it is compiled as part of this app (one React, no package link).
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Inline BOOKING_LAST_TIME so the booking form (browser) and the API (server) use the same value.
  env: { BOOKING_LAST_TIME: process.env.BOOKING_LAST_TIME ?? "" },
  // Dynamic pages (the menu reader reads ?page=) stream their <head> tags by default. Our metadata needs no
  // data fetching, so send it up front for every client: tools and crawlers then always see it.
  htmlLimitedBots: /.*/,
  images: { formats: ["image/avif", "image/webp"], qualities: [70] }
};

export default nextConfig;
