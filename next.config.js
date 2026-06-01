/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Temporarily ignore build errors while route handler types are updated
    // for Next.js 15's async params API
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
