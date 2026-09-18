import Link from 'next/link'

import { LegalDocument } from '@/components/shared/legal-document'
import { siteConfig } from '@/config/site'
import { createMetadata } from '@/lib/metadata'

import type { Metadata } from 'next'

export const metadata: Metadata = createMetadata({
  title: 'Privacy Policy',
  description: 'How WixPearl handles information submitted through this website.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy policy" updated="18 September 2026">
      <h2>Information we collect</h2>
      <p>
        When you submit a project inquiry, we receive the contact and project information you
        provide. We also use privacy-focused website analytics to understand aggregate usage and
        site performance.
      </p>
      <h2>How we use information</h2>
      <p>
        Inquiry information is used to assess and respond to your request, communicate about a
        potential engagement, and protect the website from abuse. We do not sell personal data.
      </p>
      <h2>Service providers</h2>
      <p>
        Hosting, email delivery, analytics, and bot protection providers process limited data on our
        behalf. Their handling of data is governed by their terms and our configuration.
      </p>
      <h2>Retention and security</h2>
      <p>
        We retain correspondence only as long as reasonably needed for business, legal, and security
        purposes. We use proportionate technical and organizational safeguards, but no internet
        transmission can be guaranteed completely secure.
      </p>
      <h2>Your choices</h2>
      <p>
        You may ask about, correct, or request deletion of personal information held through an
        inquiry, subject to applicable legal obligations.
      </p>
      <h2>Contact</h2>
      <p>
        For privacy questions, email{' '}
        <Link
          className="text-primary underline underline-offset-4"
          href={`mailto:${siteConfig.email}`}
        >
          {siteConfig.email}
        </Link>
        .
      </p>
    </LegalDocument>
  )
}
