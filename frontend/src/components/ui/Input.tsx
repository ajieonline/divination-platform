'use client'

import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  error?: string
  icon?: ReactNode
  className?: string
}

export default function Input({ label, placeholder, value, onChange, type = 'text', error, icon, className }: InputProps) {
  return (
    <div className={clsx('space-y-1.5', className)}>
      {label && <label className="block text-sm font-medium text-mystical-200">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-mystical-400">{icon}</div>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={clsx(
            'w-full bg-mystical-900/50 border border-mystical-600/30 rounded-xl px-4 py-3 text-white placeholder-mystical-400',
            'focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all duration-200',
            icon && 'pl-10',
            error && 'border-red-500/50'
          )}
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
