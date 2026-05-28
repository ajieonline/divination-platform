import React from 'react'

/**
 * Simple Markdown renderer for AI-generated divination readings.
 * Converts basic Markdown (headers, bold, lists, line breaks) to React elements.
 * Does NOT use dangerouslySetInnerHTML — renders via React elements for safety.
 */
export default function MarkdownText({ text, className = '' }) {
  if (!text) return null

  const lines = text.split('\n')
  const elements = []
  let listItems = []

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2">
          {listItems.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      )
      listItems = []
    }
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()

    // Empty line → paragraph break
    if (!trimmed) {
      flushList()
      return
    }

    // Header: ### Title or ## Title or # Title
    const headerMatch = trimmed.match(/^(#{1,3})\s+(.+)/)
    if (headerMatch) {
      flushList()
      const level = headerMatch[1].length
      const Tag = level === 1 ? 'h3' : level === 2 ? 'h4' : 'h5'
      elements.push(
        <Tag key={`h-${i}`} className="font-bold text-yellow-300 mt-4 mb-2">
          {renderInline(headerMatch[2])}
        </Tag>
      )
      return
    }

    // List item: - item or * item or 1. item
    const listMatch = trimmed.match(/^[-*]\s+(.+)/)
    if (listMatch) {
      listItems.push(listMatch[1])
      return
    }

    // Numbered list: 1. item
    const numMatch = trimmed.match(/^\d+\.\s+(.+)/)
    if (numMatch) {
      listItems.push(numMatch[1])
      return
    }

    // Regular paragraph
    flushList()
    elements.push(
      <p key={`p-${i}`} className="my-1">
        {renderInline(trimmed)}
      </p>
    )
  })

  flushList()

  return <div className={className}>{elements}</div>
}

/**
 * Render inline Markdown: **bold**, *italic*, `code`
 */
function renderInline(text) {
  if (!text) return null

  // Split on bold markers **text**
  const parts = []
  let remaining = text
  let keyIdx = 0

  // Handle **bold** and *italic* and `code`
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
  let match
  let lastIndex = 0

  while ((match = regex.exec(text)) !== null) {
    // Text before the match
    if (match.index > lastIndex) {
      parts.push(<span key={keyIdx++}>{text.slice(lastIndex, match.index)}</span>)
    }

    if (match[2]) {
      // **bold**
      parts.push(<strong key={keyIdx++} className="text-yellow-300 font-bold">{match[2]}</strong>)
    } else if (match[3]) {
      // *italic*
      parts.push(<em key={keyIdx++} className="text-purple-300">{match[3]}</em>)
    } else if (match[4]) {
      // `code`
      parts.push(
        <code key={keyIdx++} className="px-1.5 py-0.5 rounded bg-purple-900/50 text-yellow-200 text-xs font-mono">
          {match[4]}
        </code>
      )
    }

    lastIndex = match.index + match[0].length
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push(<span key={keyIdx++}>{text.slice(lastIndex)}</span>)
  }

  return parts.length > 0 ? parts : text
}
