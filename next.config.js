/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: Bu seçenek tüm ESLint kontrollerini devre dışı bırakır
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
