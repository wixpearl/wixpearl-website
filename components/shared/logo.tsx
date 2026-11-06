import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  href?: string
  priority?: boolean
}

export function Logo({ className, href = '/', priority = false }: LogoProps) {
  return (
    <Link
      href={href}
      data-slot="logo"
      className={cn(
        'group/logo focus-visible:ring-ring inline-flex shrink-0 items-center gap-2.5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none',
        className
      )}
      aria-label="WixPearl home"
    >
      <span
        aria-hidden="true"
        data-slot="logo-mark"
        className="relative isolate grid size-8.5 place-items-center transition-transform duration-300 ease-out group-hover/logo:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
      >
        <Image
          src="/brand/wixpearl-logo.png"
          alt=""
          width={1254}
          height={1254}
          preload={priority}
          className="relative z-10 size-8.5 object-contain drop-shadow-[0_2px_4px_rgba(11,36,71,0.08)] dark:hidden"
        />
        <Image
          src="/brand/wixpearl-logo-dark-mode.png"
          alt=""
          width={1254}
          height={1254}
          preload={priority}
          className="relative z-10 hidden size-8.5 object-contain drop-shadow-[0_2px_8px_rgba(237,28,36,0.3)] dark:block"
        />
      </span>
      <span className="text-heading text-[1.15rem] font-semibold tracking-[-0.04em] transition-colors duration-300 motion-reduce:transition-none">
        Wix
        <span className="text-[var(--accent)] transition-colors group-hover/logo:text-[var(--accent-hover)]">
          Pearl
        </span>
      </span>
    </Link>
  )
}
