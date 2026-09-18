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
        // Positioning & stacking
        'sticky top-0 z-50 w-full',
        // Refined glass-morphism surface with layered depth
        'bg-background/80 backdrop-blur-2xl backdrop-saturate-150',
        'supports-[backdrop-filter:blur(0)]:bg-background/65',
        // Hairline border with subtle top highlight
        'border-border/60 border-b',
        'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px',
        'before:via-foreground/6 before:bg-linear-to-r before:from-transparent before:to-transparent',
        // Soft diffused shadow — feels lighter than a hard drop
        'shadow-[0_1px_0_0_color-mix(in_oklch,var(--border)_55%,transparent),0_12px_40px_-24px_color-mix(in_oklch,var(--ink)_45%,transparent)]',
        // Smooth transitions for theme changes
        'transition-[background-color,border-color,box-shadow] duration-300 ease-out',
        className
      )}
    >
      {/* Ambient gradient glow — adds quiet depth without noise */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 -bottom-px -z-10 h-px',
          'via-primary/25 bg-linear-to-r from-transparent to-transparent'
        )}
      />

      <Container>
        <div
          className={cn(
            // Generous, balanced height with room to breathe
            'flex h-16 items-center justify-between gap-8 lg:h-20',
            // Subtle entrance transition
            'transition-[height] duration-300 ease-out'
          )}
        >
          {/* Brand */}
          <div className="flex shrink-0 items-center transition-opacity duration-300 hover:opacity-85">
            <Logo priority />
          </div>

          {/* Desktop navigation — centered for visual balance */}
          <div className="hidden flex-1 justify-center lg:flex">
            <Navigation />
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2.5 lg:flex">
            <ThemeToggle />

            {/* Divider for visual rhythm */}
            <span aria-hidden="true" className="bg-border/70 mx-1 h-5 w-px" />

            <Link
              href="/contact"
              className={buttonVariants({
                variant: 'default',
                size: 'default',
                className: cn(
                  // Elevated primary action with layered shadow
                  'group relative overflow-hidden',
                  'shadow-primary/20 shadow-lg',
                  // Smooth hover lift
                  'transition-all duration-300 ease-out',
                  'hover:shadow-primary/[0.14] hover:-translate-y-px hover:shadow-xl',
                  'active:translate-y-0 active:shadow-md',
                  // Focus ring for accessibility
                  'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2'
                ),
              })}
            >
              {/* Shimmer sweep on hover */}
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute inset-0 -translate-x-full',
                  'bg-linear-to-r from-transparent via-white/20 to-transparent',
                  'transition-transform duration-700 ease-out',
                  'group-hover:translate-x-full'
                )}
              />
              <span className="relative">Start a Project</span>
            </Link>
          </div>

          {/* Mobile navigation */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <ThemeToggle />
            <MobileNavigation />
          </div>
        </div>
      </Container>
    </header>
  )
}
