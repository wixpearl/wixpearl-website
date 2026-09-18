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
        'bg-card inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium',
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
