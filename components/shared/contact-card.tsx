import { Stack } from '@/components/layout/stack'

import type { LucideIcon } from 'lucide-react'

interface ContactCardProps {
  title: string
  value: string
  description?: string
  href?: string
  icon: LucideIcon
}

export function ContactCard({ title, value, description, href, icon: Icon }: ContactCardProps) {
  const content = (
    <>
      <div className="surface-subtle text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
        <Icon className="size-5" aria-hidden="true" />
      </div>

      <Stack gap="xs">
        <h3 className="font-semibold">{title}</h3>

        <p className="font-medium">{value}</p>

        {description ? (
          <p className="text-muted-foreground text-sm leading-6">{description}</p>
        ) : null}
      </Stack>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className="pearl-surface interactive-surface flex gap-4 rounded-2xl p-5 sm:p-6"
      >
        {content}
      </a>
    )
  }

  return <div className="pearl-surface flex gap-4 rounded-2xl p-5 sm:p-6">{content}</div>
}
