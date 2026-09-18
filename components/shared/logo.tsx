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
        'group/logo focus-visible:ring-ring inline-flex shrink-0 items-center gap-2.5 rounded-2xl transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none',
        className
      )}
      aria-label="WixPearl home"
    >
      <span
        aria-hidden="true"
        className="border-primary/20 group-hover/logo:border-primary/35 relative isolate grid h-10 w-14 place-items-center overflow-hidden rounded-[1rem] border bg-[linear-gradient(145deg,rgba(255,255,255,0.98),color-mix(in_oklch,var(--primary)_10%,white))] shadow-[0_10px_28px_-18px_color-mix(in_oklch,var(--primary)_75%,transparent),inset_0_1px_0_rgba(255,255,255,0.9)] transition-[transform,box-shadow,border-color] duration-300 ease-out group-hover/logo:-translate-y-0.5 group-hover/logo:shadow-[0_14px_32px_-17px_color-mix(in_oklch,var(--primary)_85%,transparent),inset_0_1px_0_rgba(255,255,255,0.95)] before:absolute before:-top-5 before:-right-3 before:size-9 before:rounded-full before:bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_70%)] motion-reduce:transform-none motion-reduce:transition-none"
      >
        <Image
          src="/brand/logo-mark-transparent.png"
          alt=""
          width={52}
          height={29}
          preload={priority}
          data-slot="logo-mark"
          className="relative z-10 h-auto w-12 drop-shadow-[0_4px_7px_rgba(15,30,70,0.14)]"
        />
      </span>
      <span className="text-foreground text-[1.15rem] font-semibold tracking-[-0.04em] transition-colors duration-300 group-hover/logo:text-[color-mix(in_oklch,var(--foreground)_82%,var(--primary))] motion-reduce:transition-none">
        Wix<span className="text-primary">Pearl</span>
      </span>
    </Link>
  )
}
