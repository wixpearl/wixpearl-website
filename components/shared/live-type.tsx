'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

interface LiveTypeProps {
  phrases: readonly string[]
  className?: string
}

export function LiveType({ phrases, className }: LiveTypeProps) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [characterCount, setCharacterCount] = useState(phrases[0]?.length ?? 0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (motionQuery.matches || phrases.length < 2) {
      return
    }

    const phrase = phrases[phraseIndex] ?? ''
    const atEnd = characterCount === phrase.length
    const atStart = characterCount === 0
    const delay = atEnd && !deleting ? 1800 : deleting ? 42 : 72

    const timeout = window.setTimeout(() => {
      if (atEnd && !deleting) {
        setDeleting(true)
        return
      }

      if (atStart && deleting) {
        setDeleting(false)
        setPhraseIndex((current) => (current + 1) % phrases.length)
        return
      }

      setCharacterCount((current) => current + (deleting ? -1 : 1))
    }, delay)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [characterCount, deleting, phraseIndex, phrases])

  const phrase = phrases[phraseIndex] ?? ''

  return (
    <span data-slot="live-type" className={cn('inline-flex min-w-[20ch] items-center', className)}>
      <span className="sr-only">
        Custom software, practical AI, workflow automation, and technical clarity
      </span>
      <span aria-hidden="true">
        {phrase.slice(0, characterCount)}
        <span className="typing-caret ml-0.5 inline-block h-[1em] w-px translate-y-[0.12em] bg-current" />
      </span>
    </span>
  )
}
