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
  variant?: 'ambient' | 'plain'
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
  variant = 'ambient',
  className,
}: PageHeaderProps) {
  const isCentered = align === 'center'

  return (
    <Section
      data-slot="page-header"
      spacing="xl"
      className={cn('relative isolate overflow-hidden', className)}
    >
      {variant === 'ambient' ? (
        <>
          <div
            aria-hidden="true"
            className="pearl-grid absolute inset-x-0 top-0 -z-10 h-full opacity-22"
          />
          <div
            aria-hidden="true"
            className="bg-primary/9 absolute -top-40 right-[8%] -z-10 size-104 rounded-full blur-3xl"
          />
        </>
      ) : null}
      <Container className="relative">
        <Stack
          gap="lg"
          align={isCentered ? 'center' : 'start'}
          className={cn('max-w-4xl', isCentered && 'mx-auto text-center')}
        >
          {breadcrumbs}

          <Stack gap="md" align={isCentered ? 'center' : 'start'}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

            <h1 className="font-display max-w-3xl text-4xl leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
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
