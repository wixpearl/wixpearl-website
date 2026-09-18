import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'

const sectionSpacing = {
  none: '',
  sm: 'py-10 sm:py-12 lg:py-16',
  md: 'py-12 sm:py-16 lg:py-20',
  lg: 'py-16 sm:py-20 lg:py-24',
  xl: 'py-20 sm:py-24 lg:py-32',
} as const

type SectionSpacing = keyof typeof sectionSpacing

interface SectionProps extends ComponentProps<'section'> {
  spacing?: SectionSpacing
}

export function Section({ spacing = 'lg', className, ...props }: SectionProps) {
  return (
    <section data-slot="section" className={cn(sectionSpacing[spacing], className)} {...props} />
  )
}
