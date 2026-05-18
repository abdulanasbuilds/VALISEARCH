import type { NextConfig } from 'next'

const config: NextConfig = {
  serverExternalPackages: [
    '@trigger.dev/sdk',
    '@trigger.dev/core',
    'jose',
    'uncrypto',
    'langsmith',
  ],
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default config
