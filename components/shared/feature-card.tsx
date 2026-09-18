import { Stack } from '@/components/layout/stack'

import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
}

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <Stack
      gap="md"
      className="interactive-surface hover:bg-card/55 rounded-2xl border border-transparent p-3"
    >
      <div className="surface-subtle text-primary flex size-11 items-center justify-center rounded-xl">
        <Icon className="size-5" aria-hidden="true" />
      </div>

      <Stack gap="sm">
        <h3 className="font-display text-xl font-semibold">{title}</h3>

        <p className="text-muted-foreground leading-7">{description}</p>
      </Stack>
    </Stack>
  )
}
