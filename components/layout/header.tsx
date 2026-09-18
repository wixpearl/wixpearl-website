// components/layout/header.tsx

import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Navigation } from '@/components/layout/navigation'
import { Logo } from '@/components/shared/logo'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      data-slot="header"
      className={cn(
        'sticky top-0 z-50 w-full',
        'border-border/60 border-b',
        'bg-background/90 backdrop-blur-md',
        'supports-backdrop-filter:bg-background/80',
        className
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-6 lg:h-18">
          {/* Brand */}
          <Logo />

          {/* Desktop navigation */}
          <Navigation />

          {/* Desktop CTA */}
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <Link
              href="/contact"
              className={buttonVariants({
                variant: 'default',
                size: 'default',
              })}
            >
              Start a Project
            </Link>
          </div>

          {/* Mobile navigation */}
          <div className="lg:hidden">
            <MobileNavigation />
          </div>
        </div>
      </Container>
    </header>
  )
}
