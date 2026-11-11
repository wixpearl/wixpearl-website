import { ChevronRight, Compass, Layers, Lightbulb, Sliders, TrendingUp } from 'lucide-react'

import type { DeliveryStep } from '@/config/content'
import type { LucideIcon } from 'lucide-react'

interface DeliveryStepsProps {
  items: readonly DeliveryStep[]
  variant: 'compact' | 'cards'
}

const stepIcons: Record<string, LucideIcon> = {
  '01': Compass,
  '02': Lightbulb,
  '03': Layers,
  '04': Sliders,
  '05': TrendingUp,
}

export function DeliverySteps({ items, variant }: DeliveryStepsProps) {
  if (variant === 'compact') {
    return (
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
        {items.map((step, index) => {
          const Icon = stepIcons[step.number] ?? Compass
          const isLast = index === items.length - 1

          return (
            <li key={step.number} className="relative flex flex-col">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-md border border-[#ED1C24]/15 bg-[#FFF1F2] text-[#D71920] dark:border-[#ED1C24]/25 dark:bg-[#421C26] dark:text-[#FF4D52]">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <span className="text-muted-foreground font-mono text-xs font-semibold">
                    {step.number}
                  </span>
                </div>
                {!isLast ? (
                  <ChevronRight
                    className="text-muted-foreground/50 hidden size-4 shrink-0 lg:block"
                    aria-hidden="true"
                  />
                ) : null}
              </div>

              <h3 className="font-display text-heading text-lg font-semibold">{step.title}</h3>
              {step.subtitle ? (
                <p className="text-heading mt-1 text-xs font-medium">{step.subtitle}</p>
              ) : null}
              <p className="text-muted-foreground mt-2 text-sm leading-6 text-pretty">
                {step.description}
              </p>
            </li>
          )
        })}
      </ol>
    )
  }

  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {items.map((step) => {
        const Icon = stepIcons[step.number] ?? Compass
        return (
          <li key={step.number}>
            <article
              data-particle-surface
              className="pearl-surface flex h-full flex-col rounded-lg p-6 sm:p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-md border border-[#ED1C24]/15 bg-[#FFF1F2] text-[#D71920] dark:border-[#ED1C24]/25 dark:bg-[#421C26] dark:text-[#FF4D52]">
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <span className="text-muted-foreground font-mono text-xs font-semibold tracking-wider tabular-nums">
                  {step.number}
                </span>
              </div>
              <h3 className="font-display text-heading text-xl font-semibold tracking-[-0.01em]">
                {step.title}
              </h3>
              {step.subtitle ? (
                <p className="text-heading mt-1 text-sm font-medium">{step.subtitle}</p>
              ) : null}
              <p className="text-muted-foreground mt-2.5 text-[0.9375rem] leading-7 text-pretty">
                {step.description}
              </p>
            </article>
          </li>
        )
      })}
    </ol>
  )
}
