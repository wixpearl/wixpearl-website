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
  subtitle?: string
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
    title: 'Discover',
    subtitle: 'It starts with understanding you.',
    description: 'We explore your ideas, challenges, and goals to uncover what truly matters.',
  },
  {
    number: '02',
    title: 'Imagine',
    subtitle: 'We turn possibilities into a clear direction.',
    description:
      'Through creative thinking and thoughtful planning, we shape ideas into meaningful concepts.',
  },
  {
    number: '03',
    title: 'Create',
    subtitle: 'Where ideas become reality.',
    description:
      'We bring concepts to life using modern technology, intuitive design, and purposeful development.',
  },
  {
    number: '04',
    title: 'Refine',
    subtitle: 'Making every detail count.',
    description:
      'We test, improve, and fine-tune each solution to create an experience that works.',
  },
  {
    number: '05',
    title: 'Evolve',
    subtitle: 'Built for today. Ready for tomorrow.',
    description:
      'We think ahead, creating flexible solutions that can grow and adapt as needs change.',
  },
] as const satisfies readonly DeliveryStep[]

export const principles = [
  {
    title: 'Customer Focus',
    description:
      'We put people and their goals at the center of every solution, ensuring technology serves a real purpose.',
  },
  {
    title: 'Quality',
    description:
      'Great solutions come from attention to detail, thoughtful architecture, and a commitment to doing things well.',
  },
  {
    title: 'Innovation',
    description:
      'We embrace new ideas, challenge conventional thinking, and explore practical ways to solve real problems.',
  },
  {
    title: 'Integrity',
    description:
      'We value honesty, transparency, and responsible engineering relationships in every collaboration.',
  },
  {
    title: 'Collaboration',
    description:
      'The best results come from working closely together, sharing ideas, and aligning around business outcomes.',
  },
  {
    title: 'Growth',
    description:
      'We continuously learn, adapt, and improve so the solutions we create remain dependable in an evolving world.',
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
