import { LegalDocument } from '@/components/shared/legal-document'
import { createMetadata } from '@/lib/metadata'

import type { Metadata } from 'next'

export const metadata: Metadata = createMetadata({
  title: 'Terms of Use',
  description: 'Terms governing use of the WixPearl website.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <LegalDocument title="Terms of use" updated="18 September 2026">
      <h2>Website information</h2>
      <p>
        This website provides general information about WixPearl and its services. It is not a
        binding offer, professional guarantee, or substitute for a signed services agreement.
      </p>
      <h2>Project discussions</h2>
      <p>
        Submitting an inquiry does not create a client relationship. Scope, responsibilities, fees,
        ownership, confidentiality, and delivery terms are agreed separately in writing.
      </p>
      <h2>Intellectual property</h2>
      <p>
        Unless otherwise stated, the website content and WixPearl branding may not be copied or
        reused commercially without permission.
      </p>
      <h2>Third-party services</h2>
      <p>
        Links and integrations may rely on third parties. WixPearl is not responsible for their
        independent content, availability, or privacy practices.
      </p>
      <h2>Availability and liability</h2>
      <p>
        We aim to keep this website accurate and available, but provide it without warranties of
        uninterrupted operation. Liability is limited to the extent permitted by applicable law.
      </p>
    </LegalDocument>
  )
}
