import React from 'react'

export default function MarkdownText({ text, className = '' }) {
  if (!text) return null

  const lines = normalizeReading(text).split('\n')
  const elements = []
  let listItems = []
  let listType = 'ul'

  const flushList = () => {
    if (!listItems.length) return
    const Tag = listType === 'ol' ? 'ol' : 'ul'
    const listClass = listType === 'ol'
      ? 'list-decimal list-outside pl-5 space-y-2 my-3'
      : 'list-disc list-outside pl-5 space-y-2 my-3'
    elements.push(
      <Tag key={`list-${elements.length}`} className={listClass}>
        {listItems.map((item, i) => (
          <li key={i} className="pl-1 leading-relaxed text-purple-100/82">
            {renderRichLine(item)}
          </li>
        ))}
      </Tag>
    )
    listItems = []
  }

  const pushListItem = (type, value) => {
    if (listItems.length && listType !== type) flushList()
    listType = type
    listItems.push(value)
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (!trimmed) {
      flushList()
      return
    }

    const markdownHeader = trimmed.match(/^(#{1,4})\s+(.+)/)
    if (markdownHeader) {
      flushList()
      elements.push(renderHeading(markdownHeader[2], markdownHeader[1].length, i))
      return
    }

    const bracketHeader = trimmed.match(/^【(.{1,28})】$/)
    if (bracketHeader) {
      flushList()
      elements.push(renderHeading(bracketHeader[1], 2, i))
      return
    }

    const cnHeader = trimmed.match(/^([一二三四五六七八九十]+[、.．]|第[一二三四五六七八九十]+[部分章节])\s*(.{1,30})$/)
    if (cnHeader && !/[。！？；，,]/.test(cnHeader[2])) {
      flushList()
      elements.push(renderHeading(cnHeader[2], 2, i, cnHeader[1]))
      return
    }

    const bullet = trimmed.match(/^[-*•]\s+(.+)/)
    if (bullet) {
      pushListItem('ul', bullet[1])
      return
    }

    const numbered = trimmed.match(/^(\d{1,2}[.、．]|[一二三四五六七八九十]+[、.．])\s*(.+)/)
    if (numbered) {
      pushListItem('ol', numbered[2])
      return
    }

    flushList()
    elements.push(
      <p key={`p-${i}`} className="my-2 leading-relaxed text-purple-100/82">
        {renderRichLine(trimmed)}
      </p>
    )
  })

  flushList()
  return <div className={className}>{elements}</div>
}

function normalizeReading(value) {
  return String(value)
    .replace(/\\n/g, '\n')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s+(?=(?:\d{1,2}[.、．]|[一二三四五六七八九十]+[、.．]|第[一二三四五六七八九十]+[部分章节])\s*[\u4e00-\u9fa5A-Za-z])/g, '\n')
    .replace(/([。！？；])\s*(?=(?:整体|当前|事业|爱情|情感|财运|健康|建议|提醒|总结|行动|风险|结论|今日)[：:])/g, '$1\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function renderHeading(text, level, index, marker = '') {
  const Tag = level <= 1 ? 'h3' : level === 2 ? 'h4' : 'h5'
  const sizeClass = level <= 1 ? 'text-lg' : 'text-base'
  return (
    <Tag key={`h-${index}`} className={`${sizeClass} mt-5 mb-2 font-bold text-yellow-300 first:mt-0`}>
      {marker && <span className="mr-2 text-yellow-200/70">{marker}</span>}
      {renderInline(text)}
    </Tag>
  )
}

function renderRichLine(text) {
  const keyValue = text.match(/^(.{2,18}?)[：:]\s*(.+)$/)
  if (keyValue && !/[。！？；，,]/.test(keyValue[1])) {
    return (
      <>
        <strong className="mr-1 font-bold text-yellow-300">{keyValue[1]}：</strong>
        {renderInline(keyValue[2])}
      </>
    )
  }
  return renderInline(text)
}

function renderInline(text) {
  if (!text) return null
  const parts = []
  let keyIdx = 0
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|【(.+?)】)/g
  let match
  let lastIndex = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={keyIdx++}>{text.slice(lastIndex, match.index)}</span>)
    }

    if (match[2]) {
      parts.push(<strong key={keyIdx++} className="font-bold text-yellow-300">{match[2]}</strong>)
    } else if (match[3]) {
      parts.push(<em key={keyIdx++} className="text-purple-300">{match[3]}</em>)
    } else if (match[4]) {
      parts.push(
        <code key={keyIdx++} className="rounded bg-purple-900/50 px-1.5 py-0.5 font-mono text-xs text-yellow-200">
          {match[4]}
        </code>
      )
    } else if (match[5]) {
      parts.push(<strong key={keyIdx++} className="font-bold text-yellow-200">{match[5]}</strong>)
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(<span key={keyIdx++}>{text.slice(lastIndex)}</span>)
  }

  return parts.length > 0 ? parts : text
}
