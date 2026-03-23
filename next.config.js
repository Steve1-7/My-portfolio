/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { domains: ['i.ibb.co'] },
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        '**/@swc/core-*/**',
        '**/node_modules/@esbuild/**',
        '**/node_modules/webpack/**',
      ],
    },
  },
}

module.exports = nextConfig
