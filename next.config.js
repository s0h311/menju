/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    swcPlugins: [['next-superjson2', {}]],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://menju.co',
          },
        ],
      },
      {
        source: '/api/todos/*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'xtapuuiutmkpsjijkgfw.supabase.co' }],
    formats: ['image/webp'],
  },
}

export default nextConfig
