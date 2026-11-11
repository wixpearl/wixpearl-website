'use client'

import { Layers, Lightbulb, Radio, Sparkles, TrendingUp } from 'lucide-react'
import { useRef } from 'react'

import { AnimatedBeam } from '@/components/ui/animated-beam'
import { BorderBeam } from '@/components/ui/border-beam'
import { DotPattern } from '@/components/ui/dot-pattern'
import { OrbitingCircles } from '@/components/ui/orbiting-circles'

import { HeroLogo } from './hero-logo'

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)
  const visionRef = useRef<HTMLLIElement>(null)
  const innovationRef = useRef<HTMLLIElement>(null)
  const creationRef = useRef<HTMLLIElement>(null)
  const impactRef = useRef<HTMLLIElement>(null)

  const pillars = [
    {
      ref: visionRef,
      label: 'Vision',
      detail: 'Every great solution starts with an idea.',
      icon: Lightbulb,
      position: 'top-4 left-0 sm:top-6 sm:left-2',
    },
    {
      ref: innovationRef,
      label: 'Innovation',
      detail: 'Exploring smarter ways to create value.',
      icon: Sparkles,
      position: 'top-4 right-0 sm:top-6 sm:right-2',
    },
    {
      ref: creationRef,
      label: 'Creation',
      detail: 'Turning possibilities into real solutions.',
      icon: Layers,
      position: 'bottom-4 left-0 sm:bottom-6 sm:left-2',
    },
    {
      ref: impactRef,
      label: 'Impact',
      detail: 'Building technology that makes a difference.',
      icon: TrendingUp,
      position: 'right-0 bottom-4 sm:right-2 sm:bottom-6',
    },
  ] as const

  return (
    <div
      data-slot="hero-system"
      className="border-border text-foreground relative isolate overflow-hidden rounded-xl border bg-[#F6F8FB] p-5 sm:p-6 dark:bg-[#1B1B1B]"
    >
      {/* Magic UI BorderBeam sweeping cleanly along outer edge */}
      <BorderBeam
        size={220}
        duration={7}
        borderWidth={2}
        colorFrom="#ED1C24"
        colorTo="var(--heading)"
      />

      {/* ─── Header Bar ────────────────────────────────────── */}
      <div className="border-border relative z-10 flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2.5" aria-hidden="true">
            <span className="bg-success absolute inline-flex size-full animate-ping rounded-full opacity-75" />
            <span className="bg-success relative inline-flex size-2.5 rounded-full" />
          </span>
          <span className="text-heading font-mono text-[0.7rem] font-bold tracking-[0.2em] uppercase">
            Where ideas come to life
          </span>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 font-mono text-[0.68rem] tracking-wider uppercase">
          <Radio
            className="size-3.5 animate-pulse text-[#ED1C24] dark:text-[#FF4D52]"
            aria-hidden="true"
          />
          <span>WIXPEARL / INNOVATION</span>
        </div>
      </div>

      {/* ─── Magic UI Interactive Diagram Stage ───────────────── */}
      <div
        ref={containerRef}
        className="relative flex min-h-104 items-center justify-center sm:min-h-112"
        aria-label="WixPearl innovation pillars"
      >
        {/* Magic UI DotPattern backdrop fading radially */}
        <DotPattern
          width={20}
          height={20}
          cr={1}
          className="text-heading/20 [mask-image:radial-gradient(260px_circle_at_center,white,transparent)] dark:text-white/15"
        />

        {/* Magic UI AnimatedBeams linking all 4 nodes to Center Pearl */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={visionRef}
          toRef={centerRef}
          curvature={-32}
          duration={3.4}
          pathColor="#64748B"
          pathOpacity={0.22}
          pathWidth={1.8}
          gradientStartColor="#ED1C24"
          gradientStopColor="#FF5C61"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={innovationRef}
          toRef={centerRef}
          curvature={-32}
          reverse
          delay={0.8}
          duration={3.4}
          pathColor="#64748B"
          pathOpacity={0.22}
          pathWidth={1.8}
          gradientStartColor="#ED1C24"
          gradientStopColor="#A1A1AA"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={creationRef}
          toRef={centerRef}
          curvature={32}
          delay={1.6}
          duration={3.4}
          pathColor="#64748B"
          pathOpacity={0.22}
          pathWidth={1.8}
          gradientStartColor="#ED1C24"
          gradientStopColor="#FF5C61"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={impactRef}
          toRef={centerRef}
          curvature={32}
          reverse
          delay={2.4}
          duration={3.4}
          pathColor="#64748B"
          pathOpacity={0.22}
          pathWidth={1.8}
          gradientStartColor="#ED1C24"
          gradientStopColor="#A1A1AA"
        />

        {/* Magic UI OrbitingCircles + Playwright .hero-orbit track */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="hero-orbit relative size-48 rounded-full border border-[#ED1C24]/25 sm:size-56 dark:border-[#FF4D52]/30" />

          <OrbitingCircles radius={92} duration={16} iconSize={14} path={false}>
            <span className="size-2.5 rounded-full bg-[#ED1C24] ring-4 ring-[#F6F8FB] dark:ring-[#1B1B1B]" />
            <span className="size-2 rounded-full bg-[#0B2447] ring-3 ring-[#F6F8FB] dark:bg-white/80 dark:ring-[#1B1B1B]" />
          </OrbitingCircles>

          <OrbitingCircles radius={124} duration={24} reverse iconSize={12}>
            <span className="size-2 rounded-full bg-[#0B2447]/55 dark:bg-white/40" />
          </OrbitingCircles>
        </div>

        {/* ─── Center Core Emblem & Logo ─────────────────────── */}
        <div ref={centerRef} className="relative z-20 grid place-items-center">
          <div
            aria-hidden="true"
            className="hero-pearl-breathe pointer-events-none absolute size-38 rounded-full bg-[#ED1C24]/18 blur-2xl dark:bg-[#ED1C24]/25"
          />

          <div className="hero-pearl relative grid size-26 place-items-center rounded-full sm:size-28">
            <HeroLogo glow />
            <HeroLogo />
            <span aria-hidden="true" className="hero-pearl-sheen absolute inset-0 z-3" />
          </div>
        </div>

        {/* ─── 4 Innovation Cards ────────────────────────────── */}
        <ul className="contents">
          {pillars.map(({ ref, label, detail, icon: Icon, position }) => (
            <li
              key={label}
              ref={ref}
              className={`group/card border-border bg-card absolute z-20 w-[46%] rounded-lg border p-3 transition-colors duration-200 hover:border-[#ED1C24]/50 sm:w-[44%] sm:p-3.5 dark:hover:bg-[var(--surface-raised)] ${position}`}
            >
              <div className="flex items-start gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-md border border-[#ED1C24]/15 bg-[#FFF1F2] text-[#D71920] transition-colors group-hover/card:bg-[#ED1C24] group-hover/card:text-white dark:border-[#ED1C24]/25 dark:bg-[#38181D] dark:text-[#FF4D52] dark:group-hover/card:bg-[#ED1C24] dark:group-hover/card:text-white">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <span className="text-heading font-display block text-sm font-semibold tracking-tight sm:text-[0.95rem]">
                    {label}
                  </span>
                  <p className="text-muted-foreground mt-0.5 hidden text-xs leading-snug text-pretty sm:block">
                    {detail}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ─── Footer Bar ────────────────────────────────────── */}
      <div className="border-border text-muted-foreground relative z-10 flex flex-col gap-2 border-t pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
        <span>Built around your vision</span>
        <span className="text-heading font-medium">
          Ideas <span className="text-[#ED1C24] dark:text-[#FF4D52]">→</span> Reality
        </span>
      </div>
    </div>
  )
}
