'use client'

import { useEffect } from 'react'

import { StatusPanel } from '@/components/shared/status-panel'
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
    <StatusPanel
      eyebrow="Something went wrong"
      title="We could not load this page"
      description="Please try again. If the problem continues, you can contact WixPearl directly."
      action={
        <Button type="button" size="lg" onClick={reset}>
          Try again
        </Button>
      }
    />
  )
}
