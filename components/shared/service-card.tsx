import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { LucideIcon } from 'lucide-react'

interface ServiceCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

export function ServiceCard({ title, description, href, icon: Icon }: ServiceCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="hover:border-primary/40 h-full transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-md">
        <CardHeader>
          <div className="bg-primary/10 text-primary mb-4 flex size-11 items-center justify-center rounded-lg">
            <Icon className="size-5" aria-hidden="true" />
          </div>

          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground leading-7">{description}</p>

          <div className="text-primary mt-6 inline-flex items-center gap-2 text-sm font-semibold">
            Learn more
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
