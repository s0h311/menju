/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
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
    remotePatterns: [
      // TODO termporary, should be deleted after FMS-11
      {
        protocol: 'https',
        hostname: 'www.blog.vegan-masterclass.de',
      },
      {
        protocol: 'https',
        hostname: 'www.lenamerz.de',
      },
      {
        protocol: 'https',
        hostname: 'www.images.lecker.de',
      },
      {
        protocol: 'https',
        hostname: 'www.eatbetter.de',
      },
      {
        protocol: 'https',
        hostname: 'www.hamburg.de',
      },
      {
        protocol: 'https',
        hostname: 'lenamerz.de',
      },
      {
        protocol: 'https',
        hostname: 'images.lecker.de',
      },
      { protocol: 'https', hostname: 'xtapuuiutmkpsjijkgfw.supabase.co' },
    ],
  },
}

module.exports = nextConfig
