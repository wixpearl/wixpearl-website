import type { CSSProperties } from 'react'

const particles = [
  ['8%', '18%', '0.25rem', '7s', '-1s'],
  ['20%', '72%', '0.4rem', '9s', '-3s'],
  ['33%', '34%', '0.2rem', '8s', '-4s'],
  ['45%', '84%', '0.32rem', '10s', '-2s'],
  ['56%', '12%', '0.24rem', '7.5s', '-5s'],
  ['68%', '65%', '0.44rem', '9.5s', '-6s'],
  ['77%', '27%', '0.28rem', '8.5s', '-3.5s'],
  ['88%', '78%', '0.2rem', '11s', '-7s'],
  ['14%', '46%', '0.18rem', '8s', '-2.5s'],
  ['40%', '16%', '0.3rem', '10s', '-5.5s'],
  ['73%', '88%', '0.2rem', '9s', '-4.5s'],
  ['94%', '40%', '0.34rem', '8s', '-1.5s'],
] as const

export function ParticleField({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {particles.map(([left, top, size, duration, delay], index) => (
        <span
          key={`${left}-${top}`}
          className={`animate-pearl-float bg-primary/55 absolute rounded-full shadow-[0_0_14px_color-mix(in_oklch,var(--primary)_55%,transparent)] ${index > 5 ? 'hidden sm:block' : ''}`}
          style={
            {
              left,
              top,
              width: size,
              height: size,
              '--duration': duration,
              '--delay': delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
