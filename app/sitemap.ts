import { publishedCaseStudies, services } from '@/config/content'
import { siteConfig } from '@/config/site'

import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/services', '/case-studies', '/about', '/contact', '/privacy', '/terms']
  const servicePaths = services.map((service) => `/services/${service.slug}`)
  const caseStudyPaths = publishedCaseStudies.map((caseStudy) => `/case-studies/${caseStudy.slug}`)

  return [...staticPaths, ...servicePaths, ...caseStudyPaths].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: path === '' ? 'monthly' : 'yearly',
    priority: path === '' ? 1 : path === '/contact' ? 0.9 : 0.7,
  }))
}
