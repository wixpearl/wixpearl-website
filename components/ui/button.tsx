import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border bg-clip-padding text-sm font-semibold whitespace-nowrap transition-[color,background-color,border-color] duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/65 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-[var(--primary-hover)] focus-visible:ring-primary',
        cta: 'border-transparent bg-[var(--cta)] text-[var(--cta-foreground)] hover:bg-[var(--cta-hover)] focus-visible:ring-[var(--cta)]',
        outline:
          'border-heading/30 bg-card text-heading hover:border-heading hover:bg-muted aria-expanded:bg-muted aria-expanded:text-heading dark:border-white/30 dark:bg-card dark:text-white dark:hover:bg-[var(--color-elevated)] dark:hover:border-white/65',
        secondary:
          'border-border bg-secondary text-secondary-foreground hover:bg-[var(--border)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground dark:bg-transparent dark:text-white dark:border-white/40 dark:hover:bg-white/10 dark:hover:border-white',
        ghost:
          'border-transparent hover:bg-muted hover:text-heading aria-expanded:bg-muted aria-expanded:text-heading dark:hover:bg-[var(--color-elevated)] dark:hover:text-white',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-[var(--cta-hover)] focus-visible:ring-destructive',
        link: 'border-transparent text-[var(--link)] underline-offset-4 hover:underline hover:opacity-85',
      },
      size: {
        default:
          'h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5',
        xs: "h-6 gap-1 rounded px-2 text-xs in-data-[slot=button-group]:rounded has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-11 gap-2.5 rounded-md px-6 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5',
        icon: 'size-10',
        'icon-xs':
          "size-6 rounded in-data-[slot=button-group]:rounded [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-7 rounded in-data-[slot=button-group]:rounded',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
