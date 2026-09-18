import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <Container>
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center py-20 text-center">
        <p className="text-primary font-mono text-sm font-semibold">404</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">This page is not available</h1>
        <p className="text-muted-foreground mt-4 max-w-lg leading-7">
          The address may have changed, or the page may not have been published yet.
        </p>
        <Link href="/" className={buttonVariants({ size: 'lg', className: 'mt-8' })}>
          Return home
        </Link>
      </div>
    </Container>
  )
}
