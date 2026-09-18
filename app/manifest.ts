import { siteConfig } from '@/config/site'

import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Software Engineering & IT Consulting`,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#faf8f4',
    theme_color: '#7550e8',
  }
}
