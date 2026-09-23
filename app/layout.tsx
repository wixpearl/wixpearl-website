import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Fraunces, Geist_Mono, Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { JsonLd } from '@/components/shared/json-ld'
import { SurfaceIllumination } from '@/components/shared/surface-illumination'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Software Engineering & IT Consulting`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    title: `${siteConfig.name} | Software Engineering & IT Consulting`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: siteConfig.tagline }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | Software Engineering & IT Consulting`,
    description: siteConfig.description,
    images: ['/og.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f5ee' },
    { media: '(prefers-color-scheme: dark)', color: '#111525' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn('h-full antialiased', inter.variable, geistMono.variable, fraunces.variable)}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme>
          <a
            href="#main-content"
            className="bg-background text-foreground focus:ring-ring sr-only z-100 rounded-md px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:ring-2"
          >
            Skip to content
          </a>
          <SurfaceIllumination />
          <Header />
          <main id="main-content" className="relative z-10 flex-1">
            {children}
          </main>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: siteConfig.name,
            url: siteConfig.url,
            email: siteConfig.email,
            description: siteConfig.description,
            areaServed: ['Sri Lanka', 'Worldwide'],
          }}
        />
      </body>
    </html>
  )
}
