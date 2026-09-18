import { Check, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { budgetRanges, projectTypes, timelines } from '@/lib/inquiry'
import { cn } from '@/lib/utils'

import type { InquiryField, InquiryState } from '@/lib/inquiry'
import type { ReactNode } from 'react'

const fieldClassName = cn(
  'h-11 w-full rounded-xl border border-border/70 bg-card',
  'px-3.5 text-sm text-foreground',
  'shadow-[0_1px_0_0_color-mix(in_oklch,white_30%,transparent)_inset]',
  'placeholder:text-muted-foreground/60',
  'outline-none transition-all duration-300',
  'hover:border-border',
  'focus:border-primary/60 focus:ring-3 focus:ring-primary/15',
  'disabled:cursor-not-allowed disabled:opacity-50'
)

interface FieldShellProps {
  state: InquiryState
  field: InquiryField
  label: ReactNode
  optional?: boolean
  children: ReactNode
  className?: string
}

function FieldShell({ state, field, label, optional, children, className }: FieldShellProps) {
  const message = state.fieldErrors[field]?.[0]

  return (
    <Field className={cn('gap-0', className)}>
      <FieldLabel
        htmlFor={field}
        className="text-foreground/85 flex items-center gap-2 text-[0.8125rem] font-medium"
      >
        {label}
        {optional ? (
          <span className="text-muted-foreground/70 text-xs font-normal">(optional)</span>
        ) : null}
      </FieldLabel>
      {children}
      {message ? (
        <FieldError className="mt-2 flex items-center gap-1.5 text-xs font-medium">
          <span aria-hidden="true" className="bg-destructive size-1 rounded-full" />
          {message}
        </FieldError>
      ) : null}
    </Field>
  )
}

export function ContactDetailsFields({ state }: { state: InquiryState }) {
  return (
    <fieldset className="relative space-y-6">
      <legend className="sr-only">Contact details</legend>
      <div className="grid gap-6 sm:grid-cols-2">
        <FieldShell state={state} field="name" label="Name">
          <Input
            id="name"
            name="name"
            type="text"
            className={cn(fieldClassName, 'mt-2')}
            defaultValue={state.values.name}
            autoComplete="name"
            required
          />
        </FieldShell>
        <FieldShell state={state} field="email" label="Work email">
          <Input
            id="email"
            name="email"
            type="email"
            className={cn(fieldClassName, 'mt-2')}
            defaultValue={state.values.email}
            autoComplete="email"
            required
          />
        </FieldShell>
        <FieldShell state={state} field="company" label="Company" className="sm:col-span-2">
          <Input
            id="company"
            name="company"
            type="text"
            className={cn(fieldClassName, 'mt-2')}
            defaultValue={state.values.company}
            autoComplete="organization"
            required
          />
        </FieldShell>
      </div>
    </fieldset>
  )
}

export function ProjectDetailsFields({ state }: { state: InquiryState }) {
  return (
    <fieldset className="relative space-y-6">
      <legend className="sr-only">Project details</legend>
      <div className="grid gap-6 sm:grid-cols-3">
        <FieldShell state={state} field="projectType" label="Project type">
          <select
            id="projectType"
            name="projectType"
            className={cn(fieldClassName, 'mt-2 cursor-pointer')}
            defaultValue={state.values.projectType}
            required
          >
            <option value="" disabled>
              Select a service
            </option>
            {projectTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FieldShell>
        <FieldShell state={state} field="budget" label="Approximate budget" optional>
          <select
            id="budget"
            name="budget"
            className={cn(fieldClassName, 'mt-2 cursor-pointer')}
            defaultValue={state.values.budget}
          >
            {budgetRanges.map((option) => (
              <option key={option.value || 'none'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FieldShell>
        <FieldShell state={state} field="timeline" label="Target timeline">
          <select
            id="timeline"
            name="timeline"
            className={cn(fieldClassName, 'mt-2 cursor-pointer')}
            defaultValue={state.values.timeline}
            required
          >
            <option value="" disabled>
              Select a timeline
            </option>
            {timelines.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>
    </fieldset>
  )
}

export function SummaryField({ state }: { state: InquiryState }) {
  return (
    <FieldShell state={state} field="summary" label="What would you like to improve or build?">
      <textarea
        id="summary"
        name="summary"
        rows={6}
        maxLength={2500}
        className={cn(fieldClassName, 'mt-2 h-auto resize-y py-3 leading-6')}
        defaultValue={state.values.summary}
        placeholder="Share the problem, the outcome you're aiming for, or anything that will help us understand your situation."
        required
      />
    </FieldShell>
  )
}

export function ConsentField({ state }: { state: InquiryState }) {
  const message = state.fieldErrors.privacy?.[0]

  return (
    <Field className="relative mt-8 gap-0">
      <label className="group/consent flex items-start gap-3 text-sm leading-6">
        <span className="relative mt-0.5 flex size-5 shrink-0 items-center">
          <input
            name="privacy"
            type="checkbox"
            value="accepted"
            className={cn(
              'peer size-5 shrink-0 cursor-pointer appearance-none rounded-md',
              'border-border/80 bg-card border transition-all duration-300',
              'checked:border-primary checked:bg-primary hover:border-primary/60',
              'focus-visible:ring-primary/20 focus-visible:ring-3 focus-visible:ring-offset-0 focus-visible:outline-none'
            )}
            required
          />
          <Check
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
          />
        </span>
        <span className="text-muted-foreground">
          I agree that WixPearl may use this information to assess and respond to my inquiry. See
          the{' '}
          <a
            href="/privacy"
            className="text-foreground hover:text-primary font-medium underline underline-offset-4 transition-colors"
          >
            privacy policy
          </a>
          .
        </span>
      </label>
      {message ? (
        <FieldError className="mt-2 flex items-center gap-1.5 text-xs font-medium">
          <span aria-hidden="true" className="bg-destructive size-1 rounded-full" />
          {message}
        </FieldError>
      ) : null}
    </Field>
  )
}

export function SubmissionStatus({ state }: { state: InquiryState }) {
  if (!state.message) return null

  return (
    <div
      role={state.status === 'success' ? 'status' : 'alert'}
      className={cn(
        'mt-8 flex items-start gap-3 rounded-xl border p-4 text-sm',
        state.status === 'success'
          ? 'border-emerald-600/25 bg-emerald-500/8 text-emerald-800 dark:text-emerald-300'
          : 'border-destructive/25 bg-destructive/8 text-destructive'
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
          state.status === 'success' ? 'bg-emerald-500/20' : 'bg-destructive/20'
        )}
      >
        <Check
          className={cn(
            'size-3',
            state.status === 'success'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-destructive'
          )}
        />
      </span>
      <span className="leading-6">{state.message}</span>
    </div>
  )
}

export function SubmitControls({ pending }: { pending: boolean }) {
  return (
    <div className="relative mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className={cn(
          'group/submit relative w-full overflow-hidden sm:w-auto',
          'shadow-primary/20 shadow-lg',
          'transition-all duration-400 ease-out',
          'hover:shadow-primary/[0.28] hover:-translate-y-px hover:shadow-xl',
          'disabled:cursor-not-allowed disabled:hover:translate-y-0'
        )}
      >
        {!pending ? (
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-0 -translate-x-full',
              'bg-linear-to-r from-transparent via-white/25 to-transparent',
              'transition-transform duration-700 ease-out',
              'group-hover/submit:translate-x-full'
            )}
          />
        ) : null}
        <span className="relative flex items-center gap-2">
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            'Send project inquiry'
          )}
        </span>
      </Button>
      <p className="text-muted-foreground text-xs sm:text-right">
        We typically respond within 1–2 business days.
      </p>
    </div>
  )
}
