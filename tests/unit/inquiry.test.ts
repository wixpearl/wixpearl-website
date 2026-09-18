import { describe, expect, it } from 'vitest'

import {
  inquiryFieldErrors,
  inquirySchema,
  isSuspiciousSubmission,
  parseInquiry,
} from '@/lib/inquiry'
import { buildInquiryNotification, buildInquiryReceipt } from '@/lib/inquiry-email'

const validInquiry = {
  name: 'Sam Perera',
  email: 'sam@example.com',
  company: 'Example Co',
  projectType: 'custom-software' as const,
  summary: 'We need to replace a manual operational workflow with a secure web platform.',
  budget: '15k-50k' as const,
  timeline: '1-3-months' as const,
  privacy: 'accepted' as const,
}

describe('inquiry validation', () => {
  it('accepts a balanced, valid inquiry', () => {
    expect(inquirySchema.safeParse(validInquiry).success).toBe(true)
  })

  it('maps validation failures to safe field errors', () => {
    const result = inquirySchema.safeParse({ ...validInquiry, email: 'invalid', summary: 'short' })
    expect(result.success).toBe(false)
    if (result.success) return

    const errors = inquiryFieldErrors(result.error)
    expect(errors.email?.[0]).toBe('Enter a valid work email.')
    expect(errors.summary?.[0]).toContain('30 characters')
  })

  it('normalizes form data to the public action shape', () => {
    const formData = new FormData()
    Object.entries(validInquiry).forEach(([key, value]) => {
      formData.set(key, value)
    })

    const parsed = parseInquiry(formData)
    expect(parsed.result.success).toBe(true)
    expect(parsed.values.company).toBe('Example Co')
  })
})

describe('spam controls', () => {
  it('rejects a populated honeypot', () => {
    expect(isSuspiciousSubmission({ honeypot: 'bot', startedAt: 1_000, now: 5_000 })).toBe(true)
  })

  it('rejects implausibly fast and stale submissions', () => {
    expect(isSuspiciousSubmission({ honeypot: '', startedAt: 4_000, now: 5_000 })).toBe(true)
    expect(isSuspiciousSubmission({ honeypot: '', startedAt: 1, now: 90_000_000 })).toBe(true)
  })

  it('accepts a normal completion time', () => {
    expect(isSuspiciousSubmission({ honeypot: '', startedAt: 1_000, now: 5_000 })).toBe(false)
  })
})

describe('email payloads', () => {
  it('escapes user-controlled HTML in notifications and receipts', () => {
    const input = { ...validInquiry, name: '<script>alert(1)</script>', summary: '<b>private</b>' }
    const notification = buildInquiryNotification(input)
    const receipt = buildInquiryReceipt(input)

    expect(notification.html).not.toContain('<script>')
    expect(notification.html).toContain('&lt;b&gt;private&lt;/b&gt;')
    expect(receipt.html).toContain('&lt;script&gt;')
  })
})
