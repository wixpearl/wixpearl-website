import Link from 'next/link'

import { StatusPanel } from '@/components/shared/status-panel'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <StatusPanel
      eyebrow="404"
      title="This page is not available"
      description="The address may have changed, or the page may not have been published yet."
      action={
        <Link href="/" className={buttonVariants({ size: 'lg' })}>
          Return home
        </Link>
      }
    />
  )
}
