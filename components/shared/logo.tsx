import Link from 'next/link'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  href?: string
  priority?: boolean
}

export function Logo({ className, href = '/' }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn('inline-flex shrink-0 items-center gap-2.5', className)}
      aria-label="WixPearl home"
    >
      <span
        aria-hidden="true"
        className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-[0.7rem] text-base font-bold shadow-sm"
      >
        W
      </span>
      <span className="text-lg font-semibold tracking-[-0.035em]">
        Wix<span className="text-primary">Pearl</span>
      </span>
    </Link>
  )
}
