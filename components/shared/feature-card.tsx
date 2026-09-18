import { Stack } from '@/components/layout/stack'

import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
}

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <Stack gap="md">
      <div className="bg-card text-primary flex size-10 items-center justify-center rounded-lg border shadow-sm">
        <Icon className="size-5" aria-hidden="true" />
      </div>

      <Stack gap="sm">
        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="text-muted-foreground leading-7">{description}</p>
      </Stack>
    </Stack>
  )
}
