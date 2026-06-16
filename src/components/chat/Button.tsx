'use client'
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   'bg-[#8A4FFF] hover:bg-[#6B2FE8] text-white shadow-sm hover:shadow-amethyst',
  secondary: 'bg-[#F9F8FC] hover:bg-[#E6DDF7] text-[#6B6576] border border-[#DCD8E3] hover:border-[#8A4FFF] hover:text-[#5D3FD3]',
  success:   'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
  danger:    'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-400',
  ghost:     'bg-transparent hover:bg-[#E6DDF7] text-[#8A4FFF]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-5 py-2.5 text-sm rounded-xl gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8A4FFF]/40',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
