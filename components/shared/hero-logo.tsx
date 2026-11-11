'use client'

import Image from 'next/image'
import { useSyncExternalStore } from 'react'

import darkLogo from '@/public/brand/wixpearl-logo-dark-mode.png'
import lightLogo from '@/public/brand/wixpearl-logo.png'

function subscribeToDarkClass(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  return () => {
    observer.disconnect()
  }
}

function getDarkSnapshot() {
  return document.documentElement.classList.contains('dark')
}

function getServerDarkSnapshot() {
  return false
}

export function HeroLogo({ glow = false }: { glow?: boolean }) {
  const isDark = useSyncExternalStore(subscribeToDarkClass, getDarkSnapshot, getServerDarkSnapshot)
  const logo = isDark ? darkLogo : lightLogo

  return (
    <Image
      key={isDark ? 'dark' : 'light'}
      aria-hidden="true"
      data-particles-hero-logo={!glow ? true : undefined}
      data-slot={!glow ? 'hero-pearl-logo' : undefined}
      alt=""
      className={
        glow ? 'hero-pearl-logo-glow absolute w-[82%]' : 'hero-pearl-logo relative z-2 w-[82%]'
      }
      sizes="(min-width: 640px) 5.25rem, 4.5rem"
      src={logo}
      priority
    />
  )
}
