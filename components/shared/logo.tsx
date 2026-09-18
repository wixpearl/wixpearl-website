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
      className={cn(
        'group/logo focus-visible:ring-ring inline-flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className
      )}
      aria-label="WixPearl home"
    >
      <span
        aria-hidden="true"
        className="shadow-primary/15 after:bg-primary relative grid size-9 place-items-center rounded-[0.8rem] bg-[linear-gradient(145deg,var(--ink),color-mix(in_oklch,var(--ink)_62%,var(--primary)))] text-base font-bold text-white shadow-md after:absolute after:-top-0.5 after:-right-0.5 after:size-2.5 after:rounded-full after:border after:border-white/55 after:shadow-[0_0_10px_color-mix(in_oklch,var(--primary)_62%,transparent)]"
      >
        W
      </span>
      <span className="group-hover/logo:text-primary text-lg font-semibold tracking-[-0.035em] transition-colors">
        Wix<span className="text-primary">Pearl</span>
      </span>
    </Link>
  )
}
