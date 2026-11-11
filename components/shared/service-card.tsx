import { ArrowRight, Bot, Braces, Cog, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

import { MagicCard } from '@/components/ui/magic-card'
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
      className={cn(
        'group/card relative block h-full rounded-lg focus-visible:outline-none',
        className
      )}
    >
      <MagicCard
        className="h-full rounded-lg"
        gradientFrom="#ED1C24"
        gradientTo="var(--heading)"
        gradientColor="var(--soft-red)"
        gradientOpacity={0.65}
      >
        <article
          data-particle-surface
          className={cn(
            'relative flex h-full flex-col rounded-lg p-6 sm:p-7',
            'group-focus-visible/card:ring-ring group-focus-visible/card:ring-offset-background group-focus-visible/card:ring-2 group-focus-visible/card:ring-offset-2'
          )}
        >
          {/* ─── Icon ─────────────────────────────────────────── */}
          <div
            className={cn(
              'mb-5 inline-flex size-10 shrink-0 items-center justify-center rounded-md border',
              'border-[#ED1C24]/15 bg-[#FFF1F2] text-[#D71920]',
              'dark:border-[#ED1C24]/25 dark:bg-[#421C26] dark:text-[#FF4D52]',
              'transition-colors duration-200 group-hover/card:bg-[#ED1C24] group-hover/card:text-white dark:group-hover/card:bg-[#ED1C24] dark:group-hover/card:text-white'
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </div>

          {/* ─── Title ────────────────────────────────────────── */}
          <Heading className="font-display text-heading text-xl font-semibold tracking-[-0.01em]">
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
                'inline-flex items-center gap-1.5 text-sm font-semibold',
                'text-[#D71920] dark:text-[#FF4D52]'
              )}
            >
              Learn more
              <ArrowRight
                className="size-3.5 transition-transform duration-200 group-hover/card:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </div>
        </article>
      </MagicCard>
    </Link>
  )
}
