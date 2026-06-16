'use client'
import { cn } from '@/lib/utils'

type BadgeVariant = 'blue' | 'teal' | 'amber' | 'red' | 'navy' | 'ocr' | 'user' | 'spn'

interface BadgeProps { variant?: BadgeVariant; children: React.ReactNode; className?: string }

const variantStyles: Record<BadgeVariant, string> = {
  blue:  'bg-[rgba(4,99,239,0.10)] text-[#0463EF]',
  teal:  'bg-[rgba(22,234,158,0.15)] text-[#0D8F61]',
  amber: 'bg-[rgba(255,165,0,0.12)] text-[#B45309]',
  red:   'bg-red-100 text-red-700',
  navy:  'bg-[rgba(1,1,54,0.08)] text-[#010136]',
  ocr:   'bg-[rgba(22,234,158,0.15)] text-[#0D8F61]',
  user:  'bg-[rgba(255,165,0,0.12)] text-[#B45309]',
  spn:   'bg-[rgba(4,99,239,0.10)] text-[#0463EF]',
}

export function Badge({ variant = 'blue', children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold', variantStyles[variant], className)}>
      {children}
    </span>
  )
}
