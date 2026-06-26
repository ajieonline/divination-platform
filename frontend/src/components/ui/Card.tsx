'use client'

import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  glow?: boolean
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export default function Card({ children, className, glow, hover = true, padding = 'md', onClick }: CardProps) {
  const paddings = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  }

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={clsx(
        'rounded-2xl border border-mystical-600/30 bg-mystical-800/80 backdrop-blur-sm',
        paddings[padding],
        glow && 'glow-gold',
        hover && 'cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
