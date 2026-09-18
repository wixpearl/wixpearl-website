import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'

const tones = {
  primary: 'text-primary',
  muted: 'text-muted-foreground',
  foreground: 'text-foreground',
} as const

type EyebrowTone = keyof typeof tones

interface EyebrowProps extends ComponentProps<'p'> {
  tone?: EyebrowTone
}

export function Eyebrow({ tone = 'primary', className, ...props }: EyebrowProps) {
  return (
    <p
      data-slot="eyebrow"
      className={cn(
        'font-mono text-[0.7rem] font-semibold tracking-[0.17em] uppercase',
        tones[tone],
        className
      )}
      {...props}
    />
  )
}
