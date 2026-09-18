import { Stack } from '@/components/layout/stack'

interface MetricProps {
  value: string
  label: string
  description?: string
  className?: string
}

export function Metric({ value, label, description, className }: MetricProps) {
  return (
    <Stack gap="xs" className={className}>
      <p className="text-3xl font-semibold tracking-tight sm:text-4xl">{value}</p>

      <p className="font-medium">{label}</p>

      {description ? (
        <p className="text-muted-foreground text-sm leading-6">{description}</p>
      ) : null}
    </Stack>
  )
}
