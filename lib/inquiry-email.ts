import type { InquiryInput } from '@/lib/inquiry'

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function buildInquiryNotification(input: InquiryInput) {
  const fields = [
    ['Name', input.name],
    ['Email', input.email],
    ['Company', input.company],
    ['Project type', input.projectType],
    ['Budget', input.budget || 'Not provided'],
    ['Timeline', input.timeline],
  ] as const

  const details = fields
    .map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`)
    .join('')

  return {
    subject: `New WixPearl inquiry from ${input.company}`,
    html: `${details}<h2>Project summary</h2><p>${escapeHtml(input.summary).replaceAll('\n', '<br />')}</p>`,
  }
}

export function buildInquiryReceipt(input: InquiryInput) {
  return {
    subject: 'We received your WixPearl project inquiry',
    html: `<p>Hello ${escapeHtml(input.name)},</p><p>Thank you for sharing the context for your project. We have received your inquiry and will review it carefully before responding.</p><p>— WixPearl</p>`,
  }
}
