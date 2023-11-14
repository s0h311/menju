/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    swcPlugins: [
      [
        'next-superjson-plugin',
        {
          excluded: [],
        },
      ],
    ],
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
    ]
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'xtapuuiutmkpsjijkgfw.supabase.co' }],
    formats: ['image/webp'],
  },
}

export default nextConfig
