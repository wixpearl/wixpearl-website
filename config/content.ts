export type ServiceSlug =
  'custom-software-development' | 'ai' | 'automation' | 'software-consulting'

export interface Service {
  slug: ServiceSlug
  title: string
  shortTitle: string
  description: string
  promise: string
  capabilities: readonly string[]
  outcomes: readonly string[]
}

export interface CaseStudyOutcome {
  label: string
  value: string
}

export interface CaseStudy {
  slug: string
  title: string
  summary: string
  clientLabel: string
  industry: string
  challenge: string
  solution: string
  technologies: readonly string[]
  outcomes: readonly CaseStudyOutcome[]
  testimonial?: {
    quote: string
    attribution: string
  }
  published: boolean
}

export interface DeliveryStep {
  number: string
  title: string
  description: string
}

export interface Principle {
  title: string
  description: string
}

export const services = [
  {
    slug: 'custom-software-development',
    title: 'Custom software development',
    shortTitle: 'Custom Software',
    description:
      'Purpose-built web platforms and internal systems designed around the way your team actually works.',
    promise: 'Turn a complex operational problem into software your team can rely on every day.',
    capabilities: [
      'Business-critical web applications',
      'Customer and partner portals',
      'Internal operations platforms',
      'API and third-party integrations',
    ],
    outcomes: [
      'Reduce repetitive work and operational friction',
      'Replace disconnected spreadsheets and legacy tools',
      'Create a secure foundation that can grow with the business',
    ],
  },
  {
    slug: 'ai',
    title: 'Practical AI solutions',
    shortTitle: 'AI Solutions',
    description:
      'Focused AI capabilities that improve real workflows, with human oversight and responsible data handling.',
    promise: 'Apply AI where it creates measurable value—not where it only creates novelty.',
    capabilities: [
      'Knowledge assistants and search',
      'Document and data extraction',
      'AI-enabled workflow support',
      'Evaluation and guardrail design',
    ],
    outcomes: [
      'Help teams find and use information faster',
      'Reduce manual review of repetitive documents',
      'Introduce AI with clear controls and measurable quality',
    ],
  },
  {
    slug: 'automation',
    title: 'Business automation',
    shortTitle: 'Automation',
    description:
      'Reliable workflow automation that connects systems, removes handoffs, and keeps teams focused on valuable work.',
    promise:
      'Make routine operations faster and more dependable without losing visibility or control.',
    capabilities: [
      'Workflow and approval automation',
      'System-to-system integrations',
      'Scheduled processing and notifications',
      'Operational dashboards and audit trails',
    ],
    outcomes: [
      'Shorten turnaround times',
      'Reduce avoidable data-entry errors',
      'Give teams a clearer view of work in progress',
    ],
  },
  {
    slug: 'software-consulting',
    title: 'Software consulting',
    shortTitle: 'Consulting',
    description:
      'Straightforward technical guidance for architecture, modernization, delivery planning, and engineering quality.',
    promise: 'Make better technical decisions before expensive complexity becomes permanent.',
    capabilities: [
      'Architecture and codebase reviews',
      'Modernization roadmaps',
      'Technical discovery and planning',
      'Delivery and quality engineering advice',
    ],
    outcomes: [
      'Clarify priorities, risks, and trade-offs',
      'Create an achievable delivery roadmap',
      'Improve reliability, maintainability, and security',
    ],
  },
] as const satisfies readonly Service[]

// Add approved client work here. Unapproved or incomplete records must remain unpublished.
export const caseStudies: readonly CaseStudy[] = []

export const publishedCaseStudies = caseStudies.filter((caseStudy) => caseStudy.published)

export function getService(slug: string) {
  return services.find((service) => service.slug === slug)
}

export function getPublishedCaseStudy(slug: string) {
  return publishedCaseStudies.find((caseStudy) => caseStudy.slug === slug)
}

export const deliverySteps = [
  {
    number: '01',
    title: 'Understand',
    description:
      'We map the business problem, users, constraints, and the outcome worth achieving.',
  },
  {
    number: '02',
    title: 'Design',
    description:
      'We shape the smallest robust solution and make architecture and delivery trade-offs visible.',
  },
  {
    number: '03',
    title: 'Build',
    description:
      'We deliver in clear increments with testing, security, and maintainability built into the work.',
  },
  {
    number: '04',
    title: 'Improve',
    description: 'We support the system in production and evolve it using evidence from real use.',
  },
] as const satisfies readonly DeliveryStep[]

export const principles = [
  {
    title: 'Secure by design',
    description:
      'Security is considered in the architecture, data flow, delivery process, and operations.',
  },
  {
    title: 'Built for real work',
    description:
      'Every decision starts with the people, constraints, and day-to-day work the system must support.',
  },
  {
    title: 'Reliable over flashy',
    description:
      'We favor clear engineering, predictable behavior, and maintainable systems over unnecessary novelty.',
  },
  {
    title: 'Personal and pragmatic',
    description:
      'You work directly with engineers who communicate clearly and care about the business result.',
  },
] as const satisfies readonly Principle[]

export const technologies = [
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Cloud platforms',
  'AI integrations',
  'Workflow automation',
] as const
