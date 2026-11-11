import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { Logo } from '@/components/shared/logo'
import { siteConfig } from '@/config/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="surface-subtle relative overflow-hidden border-x-0 border-b-0">
      <div
        aria-hidden="true"
        className="pearl-grid pointer-events-none absolute inset-x-0 top-0 h-full opacity-12"
      />
      <Container>
        <div className="relative grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          <div className="max-w-md space-y-4">
            <Logo />

            <p className="text-muted-foreground leading-7">
              We transform ideas into innovative digital solutions, empowering businesses to grow,
              evolve, and succeed.
            </p>

            <p className="text-heading font-display text-sm font-semibold tracking-[-0.01em]">
              Your Vision, Our Solution.
            </p>
          </div>

          <FooterColumn title="Explore" links={siteConfig.footer.explore} />

          <FooterColumn title="Connect" links={siteConfig.footer.connect} />
        </div>

        <div className="text-muted-foreground border-border relative flex flex-col gap-4 border-t py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} WixPearl. All rights reserved.</p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-heading transition-colors">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-heading transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}

interface FooterLink {
  readonly label: string
  readonly href: string
  readonly external?: boolean
}

interface FooterColumnProps {
  title: string
  links: readonly FooterLink[]
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h2 className="text-heading text-sm font-semibold">{title}</h2>

      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-heading text-sm transition-colors"
              >
                {link.label}
              </a>
            ) : link.href.startsWith('mailto:') ? (
              <a
                href={link.href}
                className="text-muted-foreground hover:text-heading text-sm transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-muted-foreground hover:text-heading text-sm transition-colors"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
