import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'canvas': 'canvas',
        'jsdom': 'jsdom'
      })
    }
    
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false
    }
    
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse']
  },
  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname:"*"
      }
    ]
  },
  eslint:{
    ignoreDuringBuilds:true
  }
};

export default nextConfig;