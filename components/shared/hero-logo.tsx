'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'

import blackLogo from '@/public/brand/wixpearl-logo-black.png'
import whiteLogo from '@/public/brand/wixpearl-logo-white.png'

export function HeroLogo({ glow = false }: { glow?: boolean }) {
  const { resolvedTheme } = useTheme()
  const logo = resolvedTheme === 'dark' ? whiteLogo : blackLogo

  return (
    <Image
      aria-hidden="true"
      data-particles-hero-logo={!glow ? true : undefined}
      data-slot={!glow ? 'hero-pearl-logo' : undefined}
      alt=""
      className={
        glow ? 'hero-pearl-logo-glow absolute w-[88%]' : 'hero-pearl-logo relative z-2 w-[88%]'
      }
      sizes="(min-width: 640px) 5.25rem, 4.5rem"
      src={logo}
    />
  )
}
