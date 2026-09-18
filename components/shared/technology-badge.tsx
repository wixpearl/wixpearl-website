import { cn } from '@/lib/utils'

import type { ReactNode } from 'react'

interface TechnologyBadgeProps {
  name: string
  icon?: ReactNode
  className?: string
}

export function TechnologyBadge({ name, icon, className }: TechnologyBadgeProps) {
  return (
    <span
      className={cn(
        'interactive-surface bg-card/78 border-border/85 before:bg-primary inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-medium shadow-sm backdrop-blur-sm before:size-1.5 before:rounded-full',
        className
      )}
    >
      {icon ? (
        <span className="flex size-4 items-center justify-center" aria-hidden="true">
          {icon}
        </span>
      ) : null}

      {name}
    </span>
  )
}
