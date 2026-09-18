import { Cluster } from '@/components/layout/cluster'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Stack } from '@/components/layout/stack'
import { Eyebrow } from '@/components/shared/eyebrow'
import { cn } from '@/lib/utils'

import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  breadcrumbs?: ReactNode
  actions?: ReactNode
  children?: ReactNode

  align?: 'start' | 'center'
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  children,
  align = 'start',
  className,
}: PageHeaderProps) {
  const isCentered = align === 'center'

  return (
    <Section data-slot="page-header" spacing="xl" className={cn('overflow-hidden', className)}>
      <Container>
        <Stack
          gap="lg"
          align={isCentered ? 'center' : 'start'}
          className={cn('max-w-4xl', isCentered && 'mx-auto text-center')}
        >
          {breadcrumbs}

          <Stack gap="md" align={isCentered ? 'center' : 'start'}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            {description && (
              <p className="text-muted-foreground max-w-3xl text-lg leading-8 text-pretty sm:text-xl">
                {description}
              </p>
            )}
          </Stack>

          {actions && <Cluster justify={isCentered ? 'center' : 'start'}>{actions}</Cluster>}

          {children}
        </Stack>
      </Container>
    </Section>
  )
}
