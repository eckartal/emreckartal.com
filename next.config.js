/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: Bu seçenek production build sırasında ESLint hatalarını görmezden gelir
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig
