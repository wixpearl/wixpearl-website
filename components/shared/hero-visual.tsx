import { Bot, Braces, Cog, Radio, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

import pearlLogo from '@/public/brand/logo-mark-transparent.png'

const capabilities = [
  {
    label: 'Software',
    detail: 'Systems built around real work',
    icon: Braces,
    position: 'top-5 left-0 sm:top-7 sm:left-2',
  },
  {
    label: 'Practical AI',
    detail: 'Useful intelligence with oversight',
    icon: Bot,
    position: 'top-5 right-0 sm:top-7 sm:right-2',
  },
  {
    label: 'Automation',
    detail: 'Reliable connected workflows',
    icon: Cog,
    position: 'bottom-5 left-0 sm:bottom-7 sm:left-2',
  },
  {
    label: 'Consulting',
    detail: 'Clear technical decisions',
    icon: ShieldCheck,
    position: 'right-0 bottom-5 sm:right-2 sm:bottom-7',
  },
] as const

const connectors = ['M50 50 L22 23', 'M50 50 L78 23', 'M50 50 L22 77', 'M50 50 L78 77']

export function HeroVisual() {
  return (
    <div
      data-slot="hero-system"
      className="relative isolate overflow-hidden rounded-[2rem] bg-[oklch(0.125_0.032_267)] p-4 text-white shadow-[0_36px_100px_-48px_oklch(0.44_0.2_283/0.72),0_18px_48px_-32px_oklch(0_0_0/0.72)] ring-1 ring-white/8 sm:p-6"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 50% 44%, oklch(0.63 0.22 292 / 0.28), transparent 31%), radial-gradient(circle at 68% 42%, oklch(0.72 0.12 213 / 0.12), transparent 24%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.055]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage: 'radial-gradient(circle at center, black, transparent 72%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_42%,oklch(0.07_0.025_267/0.68)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-violet-300/75 to-transparent"
      />

      <div className="relative flex items-center justify-between border-b border-white/9 pb-4">
        <div className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.18em] text-white/86 uppercase">
          <span className="relative flex size-2" aria-hidden="true">
            <span className="hero-pearl-breathe bg-success absolute inset-0 rounded-full" />
            <span className="bg-success relative size-2 rounded-full" />
          </span>
          One connected system
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[0.65rem] tracking-wider text-white/48">
          <Radio className="size-3" aria-hidden="true" />
          WP / SIGNAL
        </span>
      </div>

      <div className="relative min-h-108 sm:min-h-116" aria-label="WixPearl capabilities">
        <svg
          aria-hidden="true"
          className="absolute inset-0 size-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="hero-connector" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.76 0.12 213)" />
              <stop offset="55%" stopColor="oklch(0.74 0.19 292)" />
              <stop offset="100%" stopColor="oklch(0.76 0.12 213)" />
            </linearGradient>
          </defs>

          <circle
            cx="50"
            cy="50"
            r="31"
            fill="none"
            stroke="white"
            strokeOpacity="0.1"
            strokeWidth="0.25"
          />

          {connectors.map((connector, index) => (
            <g key={connector}>
              <path
                d={connector}
                fill="none"
                stroke="white"
                strokeOpacity="0.12"
                strokeWidth="0.45"
              />
              <path
                d={connector}
                fill="none"
                stroke="url(#hero-connector)"
                strokeWidth="0.55"
                pathLength="100"
                className="hero-connector-sweep"
                style={{ animationDelay: `${String(index * 420)}ms` }}
              />
            </g>
          ))}
        </svg>

        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 size-44 -translate-x-1/2 -translate-y-1/2 sm:size-52"
        >
          <div className="hero-orbit relative size-full rounded-full border border-violet-300/22 shadow-[0_0_36px_-18px_oklch(0.7_0.2_292/0.75)_inset]">
            <span className="ambient-orb absolute top-1/2 -right-1.5 size-3 -translate-y-1/2 rounded-full shadow-[0_0_18px_4px_oklch(0.74_0.19_292/0.54)]" />
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
          <div
            aria-hidden="true"
            className="hero-pearl-breathe absolute size-44 rounded-full bg-violet-500/18 blur-3xl"
          />
          <div className="hero-pearl relative grid size-24 place-items-center rounded-full sm:size-28">
            <Image
              aria-hidden="true"
              alt=""
              className="hero-pearl-logo-glow absolute w-[88%]"
              sizes="(min-width: 640px) 5.25rem, 4.5rem"
              src={pearlLogo}
            />
            <Image
              data-particles-hero-logo
              data-slot="hero-pearl-logo"
              alt=""
              className="hero-pearl-logo relative z-2 w-[88%]"
              sizes="(min-width: 640px) 5.25rem, 4.5rem"
              src={pearlLogo}
            />
            <span aria-hidden="true" className="hero-pearl-sheen absolute inset-0 z-3" />
          </div>
        </div>

        <ul className="contents">
          {capabilities.map(({ label, detail, icon: Icon, position }) => (
            <li
              key={label}
              className={`absolute w-[43%] rounded-2xl border border-white/9 bg-[oklch(0.18_0.03_267/0.72)] p-3.5 shadow-[0_12px_34px_-22px_oklch(0_0_0/0.8)] backdrop-blur-xl transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-violet-300/24 hover:bg-[oklch(0.2_0.04_270/0.78)] sm:w-[42%] sm:p-4 ${position}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/8 bg-white/5 text-violet-200">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold tracking-tight text-white/94">{label}</span>
              </div>
              <p className="mt-2 hidden text-xs leading-5 text-white/58 sm:block">{detail}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex items-center justify-between border-t border-white/9 pt-4 text-xs">
        <span className="text-white/48">Designed for your operation</span>
        <span className="font-medium text-white/92">Idea → dependable system</span>
      </div>
    </div>
  )
}
