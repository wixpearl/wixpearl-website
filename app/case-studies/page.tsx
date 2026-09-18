import { cn } from 'cn'
import { BookOpen } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { CaseStudyGrid } from '@/components/shared/case-study-grid'
import { CTA } from '@/components/shared/cta'
import { Eyebrow } from '@/components/shared/eyebrow'
import { PageHeader } from '@/components/shared/page-header'
import { publishedCaseStudies } from '@/config/content'
import { createMetadata } from '@/lib/metadata'

import type { Metadata } from 'next'

export const metadata: Metadata = createMetadata({
  title: 'Case Studies',
  description: 'Approved examples of software engineering outcomes delivered by WixPearl.',
  path: '/case-studies',
})

export default function CaseStudiesPage() {
  const hasCaseStudies = publishedCaseStudies.length > 0

  return (
    <>
      {/* ─── Page header ─────────────────────────────────────── */}
      <PageHeader
        eyebrow="Case studies"
        title="Real work, shared with care"
        description="We publish client stories only after the facts, outcomes, and permissions are approved."
      />

      {/* ─── Case studies grid ───────────────────────────────── */}
      <Section spacing="sm">
        <Container>
          {hasCaseStudies ? (
            <CaseStudyGrid
              items={publishedCaseStudies}
              headingLevel="h2"
              className="gap-6 lg:gap-8"
            />
          ) : (
            <EmptyState />
          )}
        </Container>
      </Section>

      {/* ─── CTA ─────────────────────────────────────────────── */}
      <CTA
        title="Your business problem deserves a grounded engineering conversation."
        description="Tell us where the friction is. We will help identify a sensible route forward."
      />
    </>
  )
}

/* ─── Empty state ──────────────────────────────────────────── */

function EmptyState() {
  return (
    <div className="mx-auto max-w-3xl">
      <div
        className={cn(
          'pearl-surface group/empty relative isolate overflow-hidden rounded-[2rem]',
          // Generous breathing space
          'px-8 py-14 text-center sm:px-12 sm:py-16 lg:px-16 lg:py-20',
          // Layered depth
          'shadow-[0_1px_0_0_color-mix(in_oklch,var(--border)_60%,transparent)_inset,0_30px_80px_-50px_color-mix(in_oklch,var(--ink)_25%,transparent)]'
        )}
      >
        {/* Top rim highlight — signature hairline */}
        <div
          aria-hidden="true"
          className="via-primary/45 absolute inset-x-16 top-0 h-px bg-linear-to-r from-transparent to-transparent"
        />

        {/* Primary corner glow */}
        <div
          aria-hidden="true"
          className="bg-primary/10 absolute -top-32 left-1/2 -z-10 size-72 -translate-x-1/2 rounded-full blur-[110px]"
        />

        {/* Secondary complementary glow */}
        <div
          aria-hidden="true"
          className="absolute right-1/4 -bottom-28 -z-10 size-64 rounded-full bg-[oklch(0.7_0.15_290/0.06)] blur-[100px]"
        />

        {/* Radial-masked grid */}
        <div
          aria-hidden="true"
          className="pearl-grid absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 85%)',
          }}
        />

        {/* Icon medallion */}
        <div
          className={cn(
            'relative mx-auto mb-8 grid size-14 place-items-center rounded-2xl',
            'border-primary/15 bg-primary/6 text-primary border',
            'shadow-[0_0_40px_-12px_color-mix(in_oklch,var(--primary)_40%,transparent)]'
          )}
        >
          <BookOpen className="size-6" aria-hidden="true" />
        </div>

        {/* Eyebrow */}
        <div className="relative flex justify-center">
          <Eyebrow>In preparation</Eyebrow>
        </div>

        {/* Heading */}
        <h2
          className={cn(
            'font-display relative mt-5 text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl',
            'text-foreground'
          )}
        >
          Approved stories are being prepared
        </h2>

        {/* Description */}
        <p
          className={cn(
            'text-muted-foreground relative mx-auto mt-4 max-w-xl',
            'text-[1.0625rem] leading-8 text-pretty'
          )}
        >
          We will not publish placeholder clients or invented results. In the meantime, talk with us
          directly about relevant experience and how we would approach your project.
        </p>

        {/* Quiet reassurance row */}
        <div className="text-muted-foreground relative mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="bg-primary/60 size-1.5 rounded-full" />
            Facts verified
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="bg-primary/60 size-1.5 rounded-full" />
            Permissions obtained
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="bg-primary/60 size-1.5 rounded-full" />
            Outcomes documented
          </span>
        </div>
      </div>
    </div>
  )
}
