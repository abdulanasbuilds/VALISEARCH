import type { NextConfig } from 'next'

const config: NextConfig = {
  serverExternalPackages: [
    '@trigger.dev/sdk',
    'langsmith',
  ],
  images: {
    unoptimized: true,
  },
}

export default config