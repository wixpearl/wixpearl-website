import { ArrowRight, Code2, Globe2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

import { HeroParticlesGL } from '@/components/home/hero-particles-gl'
import { Container } from '@/components/layout/container'
import { Stack } from '@/components/layout/stack'
import { HeroVisual } from '@/components/shared/hero-visual'
import { buttonVariants } from '@/components/ui/button'

import { GlyphMatrix } from '../ui/glyph-matrix'

export function HomeHero() {
  return (
    <div
      data-particle-host
      className="relative isolate flex min-h-[92vh] flex-col justify-center overflow-hidden"
    >
      {/* Enabler for Logo particle effect */}
      <HeroParticlesGL />
      <div className="relative z-10 py-18 sm:py-24 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-160 opacity-30"
        >
          <GlyphMatrix
            glyphs="01·•+*/\<>="
            cellSize={25}
            mutationRate={0.02}
            interval={95}
            fadeBottom={0.6}
            color="var(--glyph)"
          />
        </div>
        <div
          aria-hidden="true"
          className="bg-primary/10 pointer-events-none absolute top-8 left-[6%] -z-10 size-80 rounded-full blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[8%] bottom-12 -z-10 size-72 rounded-full bg-[var(--accent)]/5 blur-3xl"
        />
        <Container className="relative">
          <div className="grid items-center gap-14 lg:grid-cols-[1.03fr_0.97fr] lg:gap-18">
            <Stack gap="xl" align="start">
              {/* Interactive availability status badge */}
              <div className="surface-subtle hover:border-primary/40 inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-xs shadow-xs backdrop-blur-md transition-colors">
                <span className="relative flex size-2" aria-hidden="true">
                  <span className="bg-success absolute inline-flex size-full animate-ping rounded-full opacity-75" />
                  <span className="bg-success relative inline-flex size-2 rounded-full" />
                </span>
                <span className="text-heading font-medium">
                  Now accepting select Q2/Q3 projects
                </span>
                <span aria-hidden="true" className="text-border">
                  |
                </span>
                <span className="text-muted-foreground hidden font-mono text-[0.68rem] tracking-wider uppercase sm:inline">
                  Software · AI · Automation
                </span>
              </div>

              <Stack gap="lg">
                <h1
                  data-particle-text
                  className="font-display max-w-4xl text-5xl leading-[0.98] font-semibold tracking-[-0.048em] text-balance sm:text-6xl lg:text-7xl xl:text-[5.1rem]"
                >
                  Software shaped around{' '}
                  <span className="text-gradient">how your business works.</span>
                </h1>
                <p className="text-muted-foreground max-w-2xl text-lg leading-8 text-pretty sm:text-xl">
                  WixPearl turns complex operations into secure, dependable software with direct
                  engineering attention from discovery through delivery.
                </p>
              </Stack>

              <div className="flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
                <Link
                  href="/contact"
                  className={buttonVariants({
                    variant: 'cta',
                    size: 'lg',
                    className: 'shadow-md hover:shadow-lg',
                  })}
                >
                  Discuss your project <ArrowRight data-icon="inline-end" className="size-4" />
                </Link>
                <Link
                  href="/services"
                  className={buttonVariants({ variant: 'outline', size: 'lg' })}
                >
                  Explore services
                </Link>
              </div>

              {/* Senior engineering proof strip */}
              <div className="border-border/80 text-muted-foreground grid w-full grid-cols-1 gap-3 border-t pt-6 sm:grid-cols-3 sm:gap-4 sm:pt-7">
                <div className="flex items-center gap-2 text-xs">
                  <ShieldCheck className="text-primary size-4 shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-heading font-medium">100% Direct</strong> Senior
                    Engineers
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Code2 className="text-primary size-4 shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-heading font-medium">Zero</strong> Vendor Lock-in
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Globe2 className="text-primary size-4 shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-heading font-medium">Global</strong> Delivery Overlap
                  </span>
                </div>
              </div>
            </Stack>
            <HeroVisual />
          </div>
        </Container>
      </div>
    </div>
  )
}
