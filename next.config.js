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
    ],
  },
}

module.exports = nextConfig
