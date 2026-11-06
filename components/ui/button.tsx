import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform,filter] duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/65 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-[var(--primary-hover)] hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus-visible:ring-primary',
        cta: 'bg-[var(--cta)] text-[var(--cta-foreground)] shadow-sm hover:bg-[var(--cta-hover)] hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus-visible:ring-[var(--cta)]',
        outline:
          'border border-border bg-card/80 text-foreground shadow-sm backdrop-blur-md hover:-translate-y-0.5 hover:border-primary/50 hover:bg-muted hover:text-heading aria-expanded:bg-muted aria-expanded:text-heading dark:border-border dark:bg-card/60 dark:hover:bg-[var(--color-elevated)] dark:hover:border-white/50 dark:hover:text-white',
        secondary:
          'bg-secondary text-secondary-foreground border border-border hover:bg-[var(--border)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground dark:bg-transparent dark:text-white dark:border-white/40 dark:hover:bg-white/10 dark:hover:border-white dark:hover:text-white',
        ghost:
          'hover:bg-muted hover:text-heading aria-expanded:bg-muted aria-expanded:text-heading dark:hover:bg-[var(--color-elevated)] dark:hover:text-white',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-[var(--cta-hover)] focus-visible:ring-destructive',
        link: 'text-[var(--link)] underline-offset-4 hover:underline hover:opacity-85',
      },
      size: {
        default:
          'h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-12 gap-2.5 rounded-[0.9rem] px-6 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5',
        icon: 'size-10',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
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
