import { Container } from '@/components/layout/container'

import type { ReactNode } from 'react'

interface StatusPanelProps {
  eyebrow: string
  title: string
  description: string
  action: ReactNode
}

export function StatusPanel({ eyebrow, title, description, action }: StatusPanelProps) {
  return (
    <Container>
      <div className="pearl-surface relative mx-auto my-16 flex min-h-[52vh] max-w-2xl flex-col items-center justify-center overflow-hidden rounded-3xl px-6 py-20 text-center">
        <div
          aria-hidden="true"
          className="bg-primary/15 absolute -top-24 size-64 rounded-full blur-3xl"
        />
        <p className="text-primary font-mono text-sm font-semibold">{eyebrow}</p>
        <h1 className="relative mt-5 text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-4 max-w-lg leading-7">{description}</p>
        <div className="mt-8">{action}</div>
      </div>
    </Container>
  )
}
