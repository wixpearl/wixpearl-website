import { siteConfig } from '@/config/site'

import type { Metadata } from 'next'

export function createMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const canonical = path === '/' ? siteConfig.url : `${siteConfig.url}${path}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'website',
      images:
        path === '/' ? [{ url: '/og.png', width: 1200, height: 630, alt: siteConfig.tagline }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: path === '/' ? ['/og.png'] : [],
    },
  }
}
