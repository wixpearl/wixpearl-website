import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ArticleCardProps {
  title: string
  excerpt: string
  href: string
  category?: string
  date: string
  readingTime?: string
}

export function ArticleCard({
  title,
  excerpt,
  href,
  category,
  date,
  readingTime,
}: ArticleCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          {category ? (
            <Badge variant="secondary" className="mb-3 w-fit">
              {category}
            </Badge>
          ) : null}

          <CardTitle className="text-xl leading-snug">{title}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground line-clamp-3 leading-7">{excerpt}</p>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              {date}

              {readingTime ? ` · ${readingTime}` : ''}
            </p>

            <ArrowRight
              className="text-primary size-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
