'use client'

import { useEffect } from 'react'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Production monitoring can consume the digest without logging inquiry contents.
    if (process.env.NODE_ENV === 'development') console.error(error)
  }, [error])

  return (
    <Container>
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center py-20 text-center">
        <p className="text-primary font-mono text-sm font-semibold">Something went wrong</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">We could not load this page</h1>
        <p className="text-muted-foreground mt-4 leading-7">
          Please try again. If the problem continues, you can contact WixPearl directly.
        </p>
        <Button type="button" size="lg" className="mt-8" onClick={reset}>
          Try again
        </Button>
      </div>
    </Container>
  )
}
