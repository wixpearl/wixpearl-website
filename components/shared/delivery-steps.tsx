import { cn } from 'cn'

import type { DeliveryStep } from '@/config/content'

interface DeliveryStepsProps {
  items: readonly DeliveryStep[]
  variant: 'compact' | 'cards'
}

export function DeliverySteps({ items, variant }: DeliveryStepsProps) {
  if (variant === 'compact') {
    return (
      <ol className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
        {items.map((step) => (
          <li key={step.number} className="border-border/80 relative border-t py-7 sm:py-8">
            <div className="flex items-baseline gap-4">
              <span className="text-primary font-mono text-xs font-semibold tracking-[0.12em]">
                {step.number}
              </span>
              <h3 className="font-display text-2xl font-semibold">{step.title}</h3>
            </div>
            <p className="text-muted-foreground mt-3 max-w-md leading-7">{step.description}</p>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className={cn(
          'absolute top-9 right-0 left-0 hidden lg:block',
          'via-border/70 h-px bg-linear-to-r from-transparent to-transparent'
        )}
      />

      <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {items.map((step) => (
          <li key={step.number} className="group/step relative">
            <article
              className={cn(
                'pearl-surface relative flex h-full flex-col overflow-hidden rounded-2xl',
                'p-6 sm:p-7',
                'shadow-[0_1px_0_0_color-mix(in_oklch,var(--border)_60%,transparent)_inset]',
                'transition-all duration-400 ease-out',
                'hover:border-primary/25 hover:-translate-y-1',
                'hover:shadow-[0_1px_0_0_color-mix(in_oklch,var(--border)_60%,transparent)_inset,0_24px_48px_-24px_color-mix(in_oklch,var(--primary)_28%,transparent)]'
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute inset-x-6 top-0 h-px',
                  'via-primary/60 bg-linear-to-r from-transparent to-transparent',
                  'opacity-0 transition-opacity duration-400',
                  'group-hover/step:opacity-100'
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute -top-16 -right-16 size-36 rounded-full',
                  'bg-primary/10 blur-3xl',
                  'opacity-0 transition-opacity duration-500',
                  'group-hover/step:opacity-100'
                )}
              />
              <div className="relative mb-6 flex items-center gap-3">
                <span
                  className={cn(
                    'grid size-10 shrink-0 place-items-center rounded-xl',
                    'border-primary/15 bg-primary/[0.06] border',
                    'text-primary font-mono text-sm font-semibold tracking-wider tabular-nums',
                    'transition-all duration-400 ease-out',
                    'group-hover/step:border-primary/30 group-hover/step:bg-primary/12',
                    'group-hover/step:shadow-[0_0_20px_-6px_color-mix(in_oklch,var(--primary)_45%,transparent)]'
                  )}
                >
                  {step.number}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'hidden h-px flex-1 lg:block',
                    'from-primary/30 bg-linear-to-r to-transparent',
                    'opacity-0 transition-opacity duration-500',
                    'group-hover/step:opacity-100'
                  )}
                />
              </div>
              <h3 className="font-display text-foreground relative text-xl font-semibold tracking-[-0.01em]">
                {step.title}
              </h3>
              <p className="text-muted-foreground relative mt-3 text-[0.9375rem] leading-7 text-pretty">
                {step.description}
              </p>
            </article>
          </li>
        ))}
      </ol>
    </div>
  )
}
