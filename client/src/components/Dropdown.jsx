import React, { useState, useRef, useEffect } from 'react'

export default function Dropdown({ label, value, options, onChange, placeholder, icon, theme }) {
  const isDark = theme === 'dark'
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = options.find(o => o.value === value)

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-sm text-purple-300/60 mb-1">{label}</label>}
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all"
        style={{
          background: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(30, 15, 60, 0.8)',
          border: isDark ? '1px solid rgba(75, 85, 99, 0.5)' : '1px solid rgba(217, 70, 239, 0.3)',
          color: isDark ? 'white' : undefined
        }}>
        <span className={`flex items-center gap-2 ${selected ? 'text-white' : 'text-purple-300/50'}`}>
          {icon && <span>{icon}</span>}
          {selected ? (
            <span className={`flex items-center gap-2 ${isDark ? "text-white" : ""}`}>
              {selected.icon && <span>{selected.icon}</span>}
              <span>{selected.label}</span>
            </span>
          ) : placeholder || '请选择'}
        </span>
        <svg className={`w-4 h-4 text-purple-300/50 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl z-50 max-h-60 overflow-y-auto scrollbar-hide"
          style={{
            background: isDark ? 'rgba(31, 41, 55, 0.98)' : 'rgba(15, 8, 40, 0.98)',
            border: isDark ? '1px solid rgba(75, 85, 99, 0.5)' : '1px solid rgba(217, 70, 239, 0.3)',
            backdropFilter: 'blur(20px)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}>
          {options.map(opt => (
            <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all text-left ${
                value === opt.value ? 'text-yellow-300' : (isDark ? 'text-gray-200 hover:text-white hover:bg-gray-600/30' : 'text-purple-200/80 hover:text-white hover:bg-purple-900/30')
              }`}>
              {opt.icon && <span className="text-lg">{opt.icon}</span>}
              <div className="flex-1">
                <div>{opt.label}</div>
                {opt.desc && <div className="text-xs text-purple-300/40 mt-0.5">{opt.desc}</div>}
              </div>
              {value === opt.value && <span className="text-yellow-400">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function SearchInput({ value, onChange, placeholder, icon }) {
  const [focused, setFocused] = useState(false)
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/50">{icon || '🔍'}</div>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="input-mystic pl-10" style={{
          borderColor: focused ? '#d946ef' : 'rgba(217, 70, 239, 0.3)',
          boxShadow: focused ? '0 0 15px rgba(217, 70, 239, 0.2)' : 'none'
        }} />
    </div>
  )
}

export function ChipGroup({ options, value, onChange, multiple }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = multiple ? (value || []).includes(opt.value) : value === opt.value
        return (
          <button key={opt.value} onClick={() => {
            if (multiple) {
              const arr = value || []
              onChange(active ? arr.filter(v => v !== opt.value) : [...arr, opt.value])
            } else {
              onChange(active ? null : opt.value)
            }
          }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all"
            style={{
              background: active ? 'linear-gradient(135deg, #a21caf, #7c3aed)' : 'rgba(30, 15, 60, 0.6)',
              border: `1px solid ${active ? 'rgba(217, 70, 239, 0.6)' : 'rgba(217, 70, 239, 0.2)'}`,
              color: active ? 'white' : 'rgba(196, 181, 253, 0.8)',
              boxShadow: active ? '0 0 15px rgba(162, 28, 175, 0.3)' : 'none'
            }}>
            {opt.icon && <span>{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
