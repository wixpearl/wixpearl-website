import { z } from 'zod'

export const projectTypes = [
  { value: 'custom-software', label: 'Custom software' },
  { value: 'ai', label: 'AI solution' },
  { value: 'automation', label: 'Business automation' },
  { value: 'consulting', label: 'Software consulting' },
  { value: 'not-sure', label: 'Not sure yet' },
] as const

export const budgetRanges = [
  { value: '', label: 'Prefer not to say yet' },
  { value: 'under-5k', label: 'Under USD 5,000' },
  { value: '5k-15k', label: 'USD 5,000–15,000' },
  { value: '15k-50k', label: 'USD 15,000–50,000' },
  { value: '50k-plus', label: 'USD 50,000+' },
] as const

export const timelines = [
  { value: 'asap', label: 'As soon as practical' },
  { value: '1-3-months', label: 'Within 1–3 months' },
  { value: '3-6-months', label: 'Within 3–6 months' },
  { value: 'exploring', label: 'Exploring options' },
] as const

export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(80),
  email: z.email('Enter a valid work email.').trim().max(160),
  company: z.string().trim().min(2, 'Please enter your company name.').max(120),
  projectType: z.enum(['custom-software', 'ai', 'automation', 'consulting', 'not-sure'], {
    message: 'Choose a project type.',
  }),
  summary: z
    .string()
    .trim()
    .min(30, 'Please share at least 30 characters of context.')
    .max(2500, 'Please keep the summary under 2,500 characters.'),
  budget: z.enum(['', 'under-5k', '5k-15k', '15k-50k', '50k-plus']),
  timeline: z.enum(['asap', '1-3-months', '3-6-months', 'exploring'], {
    message: 'Choose a target timeline.',
  }),
  privacy: z.literal('accepted', { message: 'You must accept the privacy notice.' }),
})

export type InquiryInput = z.infer<typeof inquirySchema>
export type InquiryField = keyof InquiryInput

export interface InquiryValues {
  name: string
  email: string
  company: string
  projectType: string
  summary: string
  budget: string
  timeline: string
}

export interface InquiryState {
  status: 'idle' | 'error' | 'success'
  message: string
  fieldErrors: Partial<Record<InquiryField, string[]>>
  values: InquiryValues
}

export function isSuspiciousSubmission({
  honeypot,
  startedAt,
  now = Date.now(),
}: {
  honeypot: string
  startedAt: number
  now?: number
}) {
  const elapsed = now - startedAt
  return Boolean(honeypot) || !Number.isFinite(startedAt) || elapsed < 1500 || elapsed > 86_400_000
}

export function inquiryFieldErrors(
  error: z.ZodError<InquiryInput>
): Partial<Record<InquiryField, string[]>> {
  const errors: Partial<Record<InquiryField, string[]>> = {}

  for (const issue of error.issues) {
    const field = issue.path[0]
    if (typeof field !== 'string') continue

    const key = field as InquiryField
    errors[key] = [...(errors[key] ?? []), issue.message]
  }

  return errors
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

export function valuesFromFormData(formData: FormData): InquiryValues {
  return {
    name: getString(formData, 'name').slice(0, 80),
    email: getString(formData, 'email').slice(0, 160),
    company: getString(formData, 'company').slice(0, 120),
    projectType: getString(formData, 'projectType'),
    summary: getString(formData, 'summary').slice(0, 2500),
    budget: getString(formData, 'budget'),
    timeline: getString(formData, 'timeline'),
  }
}

export function parseInquiry(formData: FormData) {
  const values = valuesFromFormData(formData)
  return {
    values,
    result: inquirySchema.safeParse({
      ...values,
      privacy: getString(formData, 'privacy'),
    }),
  }
}
