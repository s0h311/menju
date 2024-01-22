/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
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
        source: '/api/todos/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST' },
          { key: 'Access-Control-Allow-Headers', value: 'Authorization' },
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
