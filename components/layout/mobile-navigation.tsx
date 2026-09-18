'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'

import { Logo } from '@/components/shared/logo'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export function MobileNavigation() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pathname = usePathname()

  function openNavigation() {
    dialogRef.current?.showModal()
  }

  function closeNavigation() {
    dialogRef.current?.close()
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        className={buttonVariants({ variant: 'ghost', size: 'icon' })}
        onClick={openNavigation}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="mobile-navigation-title"
        className="text-foreground m-0 ml-auto h-full max-h-none w-[min(90vw,24rem)] max-w-none border-l bg-transparent p-0 backdrop:bg-black/35"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeNavigation()
        }}
      >
        <div className="bg-background flex min-h-full flex-col shadow-2xl">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Logo />
            <button
              type="button"
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
              aria-label="Close navigation"
              onClick={closeNavigation}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <h2 id="mobile-navigation-title" className="sr-only">
            Main navigation
          </h2>

          <nav aria-label="Mobile navigation" className="flex flex-1 flex-col px-4 py-6">
            {siteConfig.navigation.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeNavigation}
                  className={cn(
                    'text-foreground hover:text-primary focus-visible:ring-ring border-b py-4 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    isActive && 'text-primary'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            })}

            <Link
              href="/contact"
              onClick={closeNavigation}
              className={cn(buttonVariants({ size: 'lg' }), 'mt-6')}
            >
              Start a Project
            </Link>

            <div className="mt-auto flex items-center justify-between border-t pt-6">
              <span className="text-muted-foreground text-sm">Color theme</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </dialog>
    </>
  )
}
