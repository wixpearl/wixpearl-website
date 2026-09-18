import { Card, CardContent } from '@/components/ui/card'

interface TestimonialCardProps {
  quote: string
  name: string
  role?: string
  company?: string
}

export function TestimonialCard({ quote, name, role, company }: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-6 sm:p-8">
        <blockquote className="flex-1">
          <p className="text-lg leading-8">“{quote}”</p>
        </blockquote>

        <footer className="mt-8 border-t pt-5">
          <p className="font-semibold">{name}</p>

          {role || company ? (
            <p className="text-muted-foreground mt-1 text-sm">
              {[role, company].filter(Boolean).join(' · ')}
            </p>
          ) : null}
        </footer>
      </CardContent>
    </Card>
  )
}
