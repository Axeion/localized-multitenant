import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add the 'standalone' output for production deployment on Vercel
  output: 'standalone',
  
  // Your existing rewrites configuration - perfect for multi-tenant setup
  async rewrites() {
    return [
      {
        source: '/((?!admin|api)):locale/:path*',
        destination: '/:tenant/:locale/:path*',
        has: [
          {
            type: 'host',
            value: '(?<tenant>.*)',
          },
        ],
      },
    ]
  },
  
  // Optional: Add image optimization configuration for Vercel
  images: {
    domains: [
      'frmsn.space',
      'gold.frmsn.space',
      'silver.frmsn.space',
      'bronze.frmsn.space',
    ],
    // Modern Next.js image config
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.frmsn.space',
      },
    ],
  },
  
  // Optional: Optimize for Vercel deployment
  poweredByHeader: false,
  reactStrictMode: true,
}

// Keep the withPayload wrapper - this is important!
export default withPayload(nextConfig)