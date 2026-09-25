// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Set SITE_URL (e.g. https://bellafairebrothers.com) once the domain is connected.
  site: process.env.SITE_URL || 'https://bellafairebrothers.com',
  image: {
    // Remote images that get downloaded and optimized at build time.
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: '**.cdninstagram.com' },
      { protocol: 'https', hostname: '**.fbcdn.net' },
    ],
  },
});
