'use client'

import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface TabsProps {
  tabs: { key: string; label: string; icon?: ReactNode }[]
  activeTab: string
  onChange: (key: string) => void
  className?: string
}

export default function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={clsx('flex bg-mystical-900/50 rounded-xl p-1 border border-mystical-600/20', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={clsx(
            'flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
            activeTab === tab.key
              ? 'bg-gold-500/20 text-gold border border-gold-500/30'
              : 'text-mystical-300 hover:text-mystical-100 hover:bg-mystical-800/50'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
