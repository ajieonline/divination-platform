'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  glow?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, glow, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 ease-in-out relative overflow-hidden'

    const variants = {
      primary: 'bg-mystical-600 hover:bg-mystical-500 text-white border border-mystical-400/30',
      secondary: 'bg-mystical-800 hover:bg-mystical-700 text-mystical-200 border border-mystical-600/30',
      gold: 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-mystical-900 font-semibold',
      ghost: 'bg-transparent hover:bg-mystical-800/50 text-mystical-200 border border-transparent hover:border-mystical-600/30',
      danger: 'bg-red-900/50 hover:bg-red-800/50 text-red-200 border border-red-500/30',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-8 py-3.5 text-lg',
    }

    return (
      <button
        ref={ref}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          glow && 'animate-glow',
          (disabled || loading) && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
