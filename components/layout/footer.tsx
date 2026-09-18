import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { Logo } from '@/components/shared/logo'
import { siteConfig } from '@/config/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-card border-t">
      <Container>
        <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          <div className="max-w-md">
            <Logo />

            <p className="text-muted-foreground mt-5 leading-7">
              Secure, reliable and scalable software engineered around the way your business works.
            </p>
          </div>

          <FooterColumn title="Services" links={siteConfig.footer.services} />

          <FooterColumn title="Company" links={siteConfig.footer.company} />
        </div>

        <div className="text-muted-foreground flex flex-col gap-4 border-t py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} WixPearl. All rights reserved.</p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}

interface FooterColumnProps {
  title: string

  links: readonly {
    label: string
    href: string
  }[]
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold">{title}</h2>

      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
