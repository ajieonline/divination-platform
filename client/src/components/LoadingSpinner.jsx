import React from 'react'

export default function LoadingSpinner({ text = 'AI正在分析中...', icon = '🔮' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      {/* Rotating icon - CSS animation */}
      <div className="text-5xl loading-spin">
        {icon}
      </div>

      {/* Pulsing dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-purple-400 loading-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      {/* Loading text */}
      <p className="text-purple-300/70 text-sm loading-fade">
        {text}
      </p>

      {/* Progress shimmer */}
      <div className="w-48 h-1 rounded-full bg-purple-900/50 overflow-hidden">
        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-purple-400 to-transparent loading-shimmer" />
      </div>
    </div>
  )
}
