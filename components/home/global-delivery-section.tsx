import { Compass, Layers, Sparkles } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Eyebrow } from '@/components/shared/eyebrow'
import { BlurFade } from '@/components/ui/blur-fade'
import { BorderBeam } from '@/components/ui/border-beam'

const guidingPrinciples = [
  {
    label: 'Think Creatively',
    icon: Sparkles,
  },
  {
    label: 'Build Purposefully',
    icon: Layers,
  },
  {
    label: 'Grow Together',
    icon: Compass,
  },
] as const

export function GlobalDeliverySection() {
  return (
    <Section spacing="md">
      <Container>
        <BlurFade inView>
          <div
            data-particle-surface
            className="pearl-surface relative overflow-hidden rounded-xl px-8 py-12 sm:px-12 sm:py-14 lg:px-16 lg:py-16"
          >
            <BorderBeam
              size={220}
              duration={9}
              borderWidth={2}
              colorFrom="#ED1C24"
              colorTo="var(--heading)"
            />
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-20">
              <div>
                <Eyebrow>More than just technology</Eyebrow>
                <h2
                  data-particle-text
                  className="font-display mt-5 text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.5rem] lg:leading-[1.08]"
                >
                  We Don&apos;t Just Build Solutions. We Build Possibilities.
                </h2>

                <div className="mt-8">
                  <p className="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                    Our guiding principles
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-3">
                    {guidingPrinciples.map(({ label, icon: Icon }) => (
                      <li
                        key={label}
                        className="border-border bg-muted/60 text-heading inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-medium"
                      >
                        <Icon
                          className="size-4 text-[#D71920] dark:text-[#FF4D52]"
                          aria-hidden="true"
                        />
                        <span>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-muted-foreground space-y-5 text-base leading-8 text-pretty sm:text-[1.0625rem]">
                <p>
                  We believe the most meaningful innovations come from collaboration, curiosity, and
                  a shared ambition to create something better.
                </p>
                <p>
                  Whether you&apos;re introducing a new idea, transforming how your business
                  operates, or exploring what technology can make possible, we&apos;re here to help
                  you move forward.
                </p>
                <p className="text-heading font-medium">
                  Because to us, every project is more than a technical challenge. It&apos;s an
                  opportunity to create something valuable.
                </p>
              </div>
            </div>
          </div>
        </BlurFade>
      </Container>
    </Section>
  )
}
