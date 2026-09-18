import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SolutionCardProps {
  title: string
  description: string
  href: string
  category?: string
}

export function SolutionCard({ title, description, href, category }: SolutionCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="hover:border-primary/40 relative h-full overflow-hidden transition-colors">
        <CardHeader>
          {category ? (
            <Badge variant="secondary" className="mb-3 w-fit">
              {category}
            </Badge>
          ) : null}

          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground leading-7">{description}</p>

          <ArrowUpRight
            className="text-primary mt-6 size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden="true"
          />
        </CardContent>
      </Card>
    </Link>
  )
}
