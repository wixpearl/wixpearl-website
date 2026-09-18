import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { PageHeader } from '@/components/shared/page-header'

import type { ReactNode } from 'react'

interface LegalDocumentProps {
  title: string
  updated: string
  children: ReactNode
}

export function LegalDocument({ title, updated, children }: LegalDocumentProps) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={title} description={`Last updated: ${updated}`} />
      <Section spacing="sm">
        <Container size="sm">
          <article className="prose-policy">{children}</article>
        </Container>
      </Section>
    </>
  )
}
