import { Bot, Braces, Cog, Radio, ShieldCheck } from 'lucide-react'

import { HeroLogo } from './hero-logo'

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
      className="border-border bg-card text-foreground dark:border-border dark:bg-card dark:text-foreground relative isolate overflow-hidden rounded-[2rem] border p-4 shadow-sm sm:p-6"
    >
      {/* Radial glow — light variant */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 transition-opacity duration-300 dark:opacity-0"
        style={{
          background:
            'radial-gradient(circle at 50% 44%, rgba(109, 170, 247, 0.12), transparent 31%), radial-gradient(circle at 68% 42%, rgba(11, 36, 71, 0.06), transparent 24%)',
        }}
      />
      {/* Radial glow — dark variant */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 dark:opacity-100"
        style={{
          background:
            'radial-gradient(circle at 50% 44%, rgba(109, 170, 247, 0.2), transparent 31%), radial-gradient(circle at 68% 42%, rgba(237, 28, 36, 0.08), transparent 24%)',
        }}
      />
      {/* Grid overlay — tinted via currentColor */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.4] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage: 'radial-gradient(circle at center, black, transparent 72%)',
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(246,248,251,0.65)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(7,24,47,0.75)_100%)]"
      />
      {/* Top accent line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-[#6DAAF7]/40 to-transparent dark:via-[#6DAAF7]/60"
      />

      <div className="border-border relative flex items-center justify-between border-b pb-4">
        <div className="text-heading flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.18em] uppercase">
          <span className="relative flex size-2" aria-hidden="true">
            <span className="hero-pearl-breathe bg-success absolute inset-0 rounded-full" />
            <span className="bg-success relative size-2 rounded-full" />
          </span>
          One connected system
        </div>
        <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-[0.65rem] tracking-wider">
          <Radio className="size-3" aria-hidden="true" />
          WP / SIGNAL
        </span>
      </div>

      <div className="relative min-h-108 sm:min-h-116" aria-label="WixPearl capabilities">
        <svg
          aria-hidden="true"
          className="text-muted-foreground/40 dark:text-muted-foreground/30 absolute inset-0 size-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="hero-connector" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6DAAF7" />
              <stop offset="50%" stopColor="#0B2447" className="dark:[stop-color:#6DAAF7]" />
              <stop offset="100%" stopColor="#ED1C24" />
            </linearGradient>
          </defs>

          <circle
            cx="50"
            cy="50"
            r="31"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.22"
            strokeWidth="0.25"
          />

          {connectors.map((connector, index) => (
            <g key={connector}>
              <path
                d={connector}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.22"
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
          <div className="hero-orbit border-border/80 dark:border-border relative size-full rounded-full border shadow-[0_0_36px_-18px_rgba(109,170,247,0.25)_inset] dark:shadow-[0_0_36px_-18px_rgba(109,170,247,0.4)_inset]">
            <span className="ambient-orb absolute top-1/2 -right-1.5 size-3 -translate-y-1/2 rounded-full shadow-[0_0_18px_4px_rgba(109,170,247,0.4)]" />
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
          <div
            aria-hidden="true"
            className="hero-pearl-breathe absolute size-44 rounded-full bg-[#6DAAF7]/15 blur-3xl dark:bg-[#6DAAF7]/12"
          />
          <div className="hero-pearl relative grid size-24 place-items-center rounded-full sm:size-28">
            <HeroLogo glow />
            <HeroLogo />
            <span aria-hidden="true" className="hero-pearl-sheen absolute inset-0 z-3" />
          </div>
        </div>

        <ul className="contents">
          {capabilities.map(({ label, detail, icon: Icon, position }) => (
            <li
              key={label}
              className={`border-border bg-card/85 hover:border-primary/40 hover:bg-card dark:border-border dark:bg-card/90 dark:hover:border-primary/50 dark:hover:bg-card absolute w-[43%] rounded-2xl border p-3.5 shadow-sm backdrop-blur-xl transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 sm:w-[42%] sm:p-4 ${position}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="border-border bg-primary/10 text-primary dark:border-border dark:bg-primary/20 dark:text-primary grid size-8 shrink-0 place-items-center rounded-lg border">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="text-heading text-sm font-semibold tracking-tight">{label}</span>
              </div>
              <p className="text-muted-foreground mt-2 hidden text-xs leading-5 sm:block">
                {detail}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-border relative flex items-center justify-between border-t pt-4 text-xs">
        <span className="text-muted-foreground">Designed for your operation</span>
        <span className="text-heading font-medium">Idea → dependable system</span>
      </div>
    </div>
  )
}
