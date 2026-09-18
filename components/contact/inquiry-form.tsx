'use client'

import { track } from '@vercel/analytics'
import Script from 'next/script'
import { useActionState, useEffect, useState } from 'react'

import { submitInquiry } from '@/app/contact/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { budgetRanges, projectTypes, timelines } from '@/lib/inquiry'

import type { InquiryField, InquiryState } from '@/lib/inquiry'

const emptyValues = {
  name: '',
  email: '',
  company: '',
  projectType: '',
  summary: '',
  budget: '',
  timeline: '',
}

const initialState: InquiryState = {
  status: 'idle',
  message: '',
  fieldErrors: {},
  values: emptyValues,
}

function FieldError({ state, field }: { state: InquiryState; field: InquiryField }) {
  const message = state.fieldErrors[field]?.[0]
  if (!message) return null
  return <p className="text-destructive mt-2 text-sm">{message}</p>
}

const fieldClassName =
  'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-11 w-full rounded-lg border px-3 text-sm outline-none focus-visible:ring-3'

export function InquiryForm() {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState)
  const [startedAt] = useState(() => Date.now().toString())

  useEffect(() => {
    if (state.status === 'success') track('inquiry_submitted')
  }, [state.status])

  return (
    <form action={formAction} className="bg-card rounded-2xl border p-6 shadow-sm sm:p-8">
      <input type="hidden" name="startedAt" value={startedAt} />
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            name="name"
            className="mt-2 h-11"
            defaultValue={state.values.name}
            autoComplete="name"
            required
          />
          <FieldError state={state} field="name" />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Work email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            className="mt-2 h-11"
            defaultValue={state.values.email}
            autoComplete="email"
            required
          />
          <FieldError state={state} field="email" />
        </div>
        <div>
          <label htmlFor="company" className="text-sm font-medium">
            Company
          </label>
          <Input
            id="company"
            name="company"
            className="mt-2 h-11"
            defaultValue={state.values.company}
            autoComplete="organization"
            required
          />
          <FieldError state={state} field="company" />
        </div>
        <div>
          <label htmlFor="projectType" className="text-sm font-medium">
            Project type
          </label>
          <select
            id="projectType"
            name="projectType"
            className={`${fieldClassName} mt-2`}
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
          <FieldError state={state} field="projectType" />
        </div>
        <div>
          <label htmlFor="budget" className="text-sm font-medium">
            Approximate budget <span className="text-muted-foreground">(optional)</span>
          </label>
          <select
            id="budget"
            name="budget"
            className={`${fieldClassName} mt-2`}
            defaultValue={state.values.budget}
          >
            {budgetRanges.map((option) => (
              <option key={option.value || 'none'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError state={state} field="budget" />
        </div>
        <div>
          <label htmlFor="timeline" className="text-sm font-medium">
            Target timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            className={`${fieldClassName} mt-2`}
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
          <FieldError state={state} field="timeline" />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="summary" className="text-sm font-medium">
          What would you like to improve or build?
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={7}
          maxLength={2500}
          className={`${fieldClassName} mt-2 h-auto resize-y py-3`}
          defaultValue={state.values.summary}
          required
        />
        <FieldError state={state} field="summary" />
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm leading-6">
        <input
          name="privacy"
          type="checkbox"
          value="accepted"
          className="accent-primary mt-1 size-4 shrink-0"
          required
        />
        <span>
          I agree that WixPearl may use this information to assess and respond to my inquiry. See
          the{' '}
          <a href="/privacy" className="text-primary underline underline-offset-4">
            privacy policy
          </a>
          .
        </span>
      </label>
      <FieldError state={state} field="privacy" />

      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="afterInteractive"
          />
          <div
            className="cf-turnstile mt-6"
            data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            data-theme="auto"
          />
        </>
      ) : null}

      {state.message ? (
        <div
          className={`mt-6 rounded-lg border p-4 text-sm ${state.status === 'success' ? 'border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300' : 'border-destructive/30 bg-destructive/10 text-destructive'}`}
          role={state.status === 'success' ? 'status' : 'alert'}
        >
          {state.message}
        </div>
      ) : null}

      <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={pending}>
        {pending ? 'Sending…' : 'Send project inquiry'}
      </Button>
    </form>
  )
}
