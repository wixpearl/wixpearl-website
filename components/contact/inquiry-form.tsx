'use client'

import { track } from '@vercel/analytics'
import Script from 'next/script'
import { useActionState, useEffect, useRef, useState } from 'react'

import { submitInquiry } from '@/app/contact/actions'
import {
  ConsentField,
  ContactDetailsFields,
  ProjectDetailsFields,
  SubmissionStatus,
  SubmitControls,
  SummaryField,
} from '@/components/contact/inquiry-form-sections'
import { cn } from '@/lib/utils'

import type { InquiryState } from '@/lib/inquiry'

const initialState: InquiryState = {
  status: 'idle',
  message: '',
  fieldErrors: {},
  values: {
    name: '',
    email: '',
    company: '',
    projectType: '',
    summary: '',
    budget: '',
    timeline: '',
  },
}

export function InquiryForm() {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState)
  const [startedAt] = useState(() => Date.now().toString())
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === 'success') track('inquiry_submitted')
  }, [state.status])

  useEffect(() => {
    const fieldOrder = [
      'name',
      'email',
      'company',
      'projectType',
      'budget',
      'timeline',
      'summary',
      'privacy',
    ] as const
    const firstInvalidField = fieldOrder.find((field) => state.fieldErrors[field]?.length)

    if (!firstInvalidField) return

    formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)?.focus()
  }, [state.fieldErrors])

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className={cn(
        'pearl-surface group/form relative isolate overflow-hidden rounded-[2rem]',
        'p-7 sm:p-10 lg:p-12',
        'shadow-[0_1px_0_0_color-mix(in_oklch,var(--border)_60%,transparent)_inset,0_40px_100px_-50px_color-mix(in_oklch,var(--ink)_25%,transparent)]'
      )}
    >
      <div
        aria-hidden="true"
        className="via-primary/40 absolute inset-x-12 top-0 h-px bg-linear-to-r from-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="bg-primary/8 absolute -top-32 -right-24 -z-10 size-80 rounded-full blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-24 -z-10 size-72 rounded-full bg-[oklch(0.7_0.15_290/0.06)] blur-[100px]"
      />

      <input type="hidden" name="startedAt" value={startedAt} />
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <ContactDetailsFields state={state} />
      <FormDivider />
      <ProjectDetailsFields state={state} />
      <FormDivider />
      <SummaryField state={state} />
      <ConsentField state={state} />

      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="afterInteractive"
          />
          <div
            className="cf-turnstile mt-8"
            data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            data-theme="auto"
          />
        </>
      ) : null}

      <SubmissionStatus state={state} />
      <SubmitControls pending={pending} />
    </form>
  )
}

function FormDivider() {
  return (
    <div
      aria-hidden="true"
      className="via-border/70 my-8 h-px bg-linear-to-r from-transparent to-transparent"
    />
  )
}
