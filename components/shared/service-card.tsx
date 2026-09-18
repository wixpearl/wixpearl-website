import { ArrowRight, Bot, Braces, Cog, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import type { Service, ServiceSlug } from '@/config/content'
import type { LucideIcon } from 'lucide-react'

const serviceIcons: Record<ServiceSlug, LucideIcon> = {
  'custom-software-development': Braces,
  ai: Bot,
  automation: Cog,
  'software-consulting': ShieldCheck,
}

interface ServiceCardProps {
  service: Service
  titleVariant?: 'full' | 'short'
  headingLevel?: 'h2' | 'h3'
  className?: string
}

export function ServiceCard({
  service,
  titleVariant = 'full',
  headingLevel = 'h3',
  className,
}: ServiceCardProps) {
  const Icon = serviceIcons[service.slug]
  const Heading = headingLevel

  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn('group/card relative block h-full', 'focus-visible:outline-none', className)}
    >
      <article
        className={cn(
          // Container — generous breathing space
          'relative flex h-full flex-col overflow-hidden rounded-2xl',
          'border-border/70 bg-card border',
          'p-6 sm:p-7',
          // Depth — subtle at rest, warmer on hover
          'shadow-[0_1px_2px_0_color-mix(in_oklch,var(--ink)_4%,transparent)]',
          'transition-all duration-400 ease-out',
          'hover:border-primary/25 hover:-translate-y-1',
          'hover:shadow-[0_24px_48px_-24px_color-mix(in_oklch,var(--primary)_25%,transparent),0_8px_16px_-8px_color-mix(in_oklch,var(--ink)_8%,transparent)]',
          // Focus ring for keyboard users
          'group-focus-visible/card:ring-ring group-focus-visible/card:ring-offset-background group-focus-visible/card:ring-2 group-focus-visible/card:ring-offset-2'
        )}
      >
        {/* Top rim highlight — appears on hover */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-6 top-0 h-px',
            'via-primary/60 bg-linear-to-r from-transparent to-transparent',
            'opacity-0 transition-opacity duration-400',
            'group-hover/card:opacity-100'
          )}
        />

        {/* Ambient corner glow — quiet depth on hover */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-16 -right-16 size-40 rounded-full',
            'bg-primary/8 blur-3xl',
            'opacity-0 transition-opacity duration-500',
            'group-hover/card:opacity-100'
          )}
        />

        {/* ─── Icon ─────────────────────────────────────────── */}
        <div
          className={cn(
            'relative mb-6 inline-flex size-12 shrink-0 items-center justify-center rounded-xl',
            'border-primary/12 bg-primary/8 text-primary border',
            'transition-all duration-400 ease-out',
            'group-hover/card:border-primary/25 group-hover/card:-translate-y-0.5',
            'group-hover/card:bg-primary/12 group-hover/card:shadow-[0_0_24px_-6px_color-mix(in_oklch,var(--primary)_45%,transparent)]'
          )}
        >
          <Icon
            className="size-5 transition-transform duration-400 group-hover/card:scale-105"
            aria-hidden="true"
          />
        </div>

        {/* ─── Title ────────────────────────────────────────── */}
        <Heading className="font-display text-foreground text-xl font-semibold tracking-[-0.01em]">
          {titleVariant === 'short' ? service.shortTitle : service.title}
        </Heading>

        {/* ─── Description ──────────────────────────────────── */}
        <p className="text-muted-foreground mt-3 text-[0.9375rem] leading-7 text-pretty">
          {service.description}
        </p>

        {/* ─── Footer CTA — pinned to bottom ────────────────── */}
        <div className="mt-auto pt-6">
          <span
            className={cn(
              'text-primary inline-flex items-center gap-1.5 text-sm font-semibold',
              'transition-colors duration-300',
              'group-hover/card:text-primary'
            )}
          >
            Learn more
            <ArrowRight
              className={cn(
                'size-3.5',
                'transition-transform duration-400 ease-out',
                'group-hover/card:translate-x-1'
              )}
              aria-hidden="true"
            />
          </span>
        </div>
      </article>
    </Link>
  )
}
