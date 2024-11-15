/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/news/:path*',
        destination: 'https://newsapi.org/v2/:path*'
      }
    ]
  }
}

module.exports = nextConfig
