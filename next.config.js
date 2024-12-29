/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint hataları production build'i engellemeyecek
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig
