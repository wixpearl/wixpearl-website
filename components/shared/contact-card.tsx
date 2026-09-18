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
      <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
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
        className="bg-card hover:border-primary/40 flex gap-4 rounded-xl border p-5 transition-colors"
      >
        {content}
      </a>
    )
  }

  return <div className="bg-card flex gap-4 rounded-xl border p-5">{content}</div>
}
