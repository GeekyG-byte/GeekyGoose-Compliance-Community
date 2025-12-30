/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure rewrites for API calls to backend container
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.INTERNAL_API_URL || 'http://api:8000'}/:path*`,
      },
    ]
  },
  // Allow external access from LAN
  env: {
    HOSTNAME: '0.0.0.0',
  },
  // Configure server timeouts for large file uploads
  serverRuntimeConfig: {
    // Increase timeout for API routes
    maxDuration: 300, // 5 minutes
  },
  // Configure for development proxy
  devIndicators: {
    buildActivity: false,
  },
  // New Next.js 16 features
  experimental: {
    // Enable optimizations for better performance
    optimizePackageImports: ['lucide-react', '@radix-ui/react-slot'],
  },
}

module.exports = nextConfig