import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CaseStudyMetric {
  label: string
  value: string
}

interface CaseStudyCardProps {
  title: string
  description: string
  href: string
  industry?: string
  metrics?: readonly CaseStudyMetric[]
}

export function CaseStudyCard({
  title,
  description,
  href,
  industry,
  metrics = [],
}: CaseStudyCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <CardHeader>
          {industry ? (
            <Badge variant="secondary" className="mb-3 w-fit">
              {industry}
            </Badge>
          ) : null}

          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground leading-7">{description}</p>

          {metrics.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <p className="text-xl font-semibold">{metric.value}</p>

                  <p className="text-muted-foreground text-sm">{metric.label}</p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="text-primary mt-6 flex items-center gap-2 text-sm font-semibold">
            View case study
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
