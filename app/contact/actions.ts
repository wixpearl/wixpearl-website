'use server'

import 'server-only'

import { headers } from 'next/headers'
import { Resend } from 'resend'

import { inquiryFieldErrors, isSuspiciousSubmission, parseInquiry } from '@/lib/inquiry'
import { buildInquiryNotification, buildInquiryReceipt } from '@/lib/inquiry-email'

import type { InquiryState } from '@/lib/inquiry'

const genericError =
  'We could not send your inquiry right now. Please try again or email us directly.'

async function verifyTurnstile(token: string, remoteIp: string | undefined) {
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) return process.env.NODE_ENV !== 'production'
  if (!token) return false

  const body = new URLSearchParams({ secret, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      cache: 'no-store',
    })
    if (!response.ok) return false

    const result: unknown = await response.json()
    return (
      typeof result === 'object' &&
      result !== null &&
      'success' in result &&
      result.success === true
    )
  } catch {
    return false
  }
}

export async function submitInquiry(
  _previousState: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const { values, result } = parseInquiry(formData)

  if (!result.success) {
    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      fieldErrors: inquiryFieldErrors(result.error),
      values,
    }
  }

  const honeypotEntry = formData.get('website')
  const honeypot = typeof honeypotEntry === 'string' ? honeypotEntry : ''
  const startedAt = Number(formData.get('startedAt'))

  if (isSuspiciousSubmission({ honeypot, startedAt })) {
    return {
      status: 'success',
      message: 'Thank you. Your inquiry has been received.',
      fieldErrors: {},
      values,
    }
  }

  const requestHeaders = await headers()
  const remoteIp = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
  const turnstileEntry = formData.get('cf-turnstile-response')
  const turnstileToken = typeof turnstileEntry === 'string' ? turnstileEntry : ''

  if (!(await verifyTurnstile(turnstileToken, remoteIp))) {
    return {
      status: 'error',
      message: 'Please complete the verification and try again.',
      fieldErrors: {},
      values,
    }
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.INQUIRY_FROM_EMAIL
  const to = process.env.INQUIRY_TO_EMAIL

  if (!apiKey || !from || !to) {
    return { status: 'error', message: genericError, fieldErrors: {}, values }
  }

  const resend = new Resend(apiKey)
  const notification = buildInquiryNotification(result.data)
  const receipt = buildInquiryReceipt(result.data)

  try {
    const [notificationResult, receiptResult] = await Promise.all([
      resend.emails.send({
        from,
        to,
        replyTo: result.data.email,
        subject: notification.subject,
        html: notification.html,
      }),
      resend.emails.send({
        from,
        to: result.data.email,
        subject: receipt.subject,
        html: receipt.html,
      }),
    ])

    if (notificationResult.error || receiptResult.error) {
      return { status: 'error', message: genericError, fieldErrors: {}, values }
    }
  } catch {
    return { status: 'error', message: genericError, fieldErrors: {}, values }
  }

  return {
    status: 'success',
    message: 'Thank you. Your inquiry has been sent. We will review it and get back to you.',
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
}
