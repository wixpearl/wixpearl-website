import Image from 'next/image'

import { cn } from '@/lib/utils'

interface ClientLogoProps {
  name: string
  src: string
  width?: number
  height?: number
  className?: string
}

export function ClientLogo({ name, src, width = 140, height = 48, className }: ClientLogoProps) {
  return (
    <div className={cn('flex min-h-20 items-center justify-center px-5', className)}>
      <Image
        src={src}
        alt={`${name} logo`}
        width={width}
        height={height}
        className="max-h-10 w-auto object-contain opacity-70 grayscale transition-[filter,opacity] hover:opacity-100 hover:grayscale-0"
      />
    </div>
  )
}
