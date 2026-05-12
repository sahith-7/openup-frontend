/** @type {import('next').NextConfig} */

// ============================================================
// OpenUp - Next.js Configuration
// ============================================================

const nextConfig = {
  // Allow images from these external domains
  // ADD new domains here as you integrate CDN/storage providers
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary image hosting
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // GitHub avatars
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google OAuth avatars
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com", // Fallback avatar generator
      },
    ],
  },

  // Environment variables exposed to the browser
  // Prefix with NEXT_PUBLIC_ to make them available on client-side
  env: {
    NEXT_PUBLIC_APP_NAME: "OpenUp",
    NEXT_PUBLIC_APP_TAGLINE: "Write. Share. Inspire.",
  },
};

module.exports = nextConfig;
