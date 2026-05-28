import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { AuthContext } from '../App'
import LoadingSpinner from '../components/LoadingSpinner'
import MarkdownText from '../components/MarkdownText'
import SaveButton from '../components/SaveButton'

const spreads = [
  { value: 'single', icon: '🃏', cards: 1 },
  { value: 'three', icon: '🃏🃏🃏', cards: 3 },
  { value: 'celtic', icon: '✨', cards: 10 }
]

const cardBack = '🔮'

const spreadPositions = {
  single: ['当前位置'],
  three: ['过去', '现在', '未来'],
  celtic: ['现状', '挑战', '过去基础', '近期过去', '可能结果', '近期未来', '自我态度', '环境影响', '希望与恐惧', '最终结果']
}

export default function Tarot() {
  const { t, i18n } = useTranslation('tarot')
  const tc = useTranslation('common')
  const { user, token } = React.useContext(AuthContext)
  const [spread, setSpread] = useState('single')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [revealedCards, setRevealedCards] = useState([])
  const [currentReveal, setCurrentReveal] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)
  const abortRef = useRef(null)  // 防重入锁
  const requestIdRef = useRef(0) // 请求ID，确保只有最新请求的结果生效
  const timersRef = useRef([])   // 清理动画定时器
  const lang = i18n.language?.startsWith('en') ? 'en' : 'zh'

  const spreadLabels = { single: t('singleCard'), three: t('threeCard'), celtic: t('celticCross') }
  const spreadDescs = { single: t('singleCardDesc'), three: t('threeCardDesc'), celtic: t('celticCrossDesc') }
  const tryQuestions = t('tryQuestions', { returnObjects: true })

  // 清理所有定时器
  const clearAllTimers = () => {
    timersRef.current.forEach(id => clearTimeout(id))
    timersRef.current = []
  }

  const doDivination = async () => {
    if (!user) { alert(tc.t('common.loginRequired')); return }
    // 防重入：如果已经在请求中，直接返回
    if (abortRef.current) return
    abortRef.current = true
    // 递增请求ID，确保只有最新请求的结果生效
    const currentRequestId = ++requestIdRef.current
    setLoading(true)
    setResult(null)
    clearAllTimers()
    setRevealedCards([])
    setCurrentReveal(-1)
    setIsAnimating(false)
    try {
      const res = await fetch('/api/tarot/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ spread, question: question || undefined, lang })
      })
      const data = await res.json()
      // 检查是否是最新请求，如果不是则丢弃结果
      if (currentRequestId !== requestIdRef.current) return
      if (!res.ok) { alert(data.error || t('error')); setLoading(false); abortRef.current = false; return }
      setResult(data)
      startCardReveal(data.cards || [])
    } catch (e) {
      if (currentRequestId === requestIdRef.current) {
        alert(tc.t('common.error'))
      }
    }
    setLoading(false)
    abortRef.current = false
  }

  const startCardReveal = (cards) => {
    setIsAnimating(true)
    setRevealedCards(new Array(cards.length).fill(false))

    cards.forEach((_, index) => {
      const id = setTimeout(() => {
        setCurrentReveal(index)
        setRevealedCards(prev => {
          const newRevealed = [...prev]
          newRevealed[index] = true
          return newRevealed
        })
        if (index === cards.length - 1) {
          const finalId = setTimeout(() => setIsAnimating(false), 600)
          timersRef.current.push(finalId)
        }
      }, 800 + index * 600)
      timersRef.current.push(id)
    })
  }

  const resetReading = () => {
    clearAllTimers()
    setResult(null)
    setQuestion('')
    setRevealedCards([])
    setCurrentReveal(-1)
    setIsAnimating(false)
  }

  const getCardEmoji = (card) => {
    const suitEmojis = {
      '权杖': '🪄', 'wands': '🪄',
      '圣杯': '🏆', 'cups': '🏆',
      '宝剑': '⚔️', 'swords': '⚔️',
      '星币': '⭐', 'pentacles': '⭐', 'coins': '⭐'
    }
    return suitEmojis[card.suit] || suitEmojis[card.suitKey] || '🃏'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-100 mb-2">{t('title')}</h1>
        <p className="text-purple-300/60">{t('subtitle')}</p>
      </motion.div>

      {!result ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* 牌阵选择 */}
          <div className="grid grid-cols-3 gap-4">
            {spreads.map(s => (
              <button key={s.value} onClick={() => !loading && setSpread(s.value)}
                className={`card-glass p-4 text-center rounded-xl border-2 transition-all ${spread === s.value ? 'border-purple-400' : 'border-transparent hover:border-purple-600'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-purple-100 font-bold text-sm">{spreadLabels[s.value]}</div>
                <div className="text-purple-300/50 text-xs mt-1">{spreadDescs[s.value]}</div>
                <div className="text-purple-400/40 text-xs mt-1">{s.cards} {t('cards') || '张牌'}</div>
              </button>
            ))}
          </div>

          {/* 问题输入 */}
          <div className="card-glass p-6 rounded-xl">
            <p className="text-sm text-purple-300/50 mb-2">{t('questionLabel')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {(Array.isArray(tryQuestions) ? tryQuestions : []).map((q, i) => (
                <button key={i} onClick={() => !loading && setQuestion(q)}
                  className={`text-left text-xs px-3 py-2 rounded-lg transition ${question === q ? 'bg-purple-700/50 text-purple-100' : 'bg-purple-900/30 text-purple-200/60 hover:text-purple-100 hover:bg-purple-800/40'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {q}
                </button>
              ))}
            </div>
            <input type="text" className="input-mystic w-full" placeholder={t('inputQuestion')}
              value={question} onChange={e => setQuestion(e.target.value)} disabled={loading} />
          </div>

          {/* 占卜按钮 */}
          {loading ? (
            <LoadingSpinner text={t('spreading')} icon="🃏" />
          ) : (
            <button onClick={doDivination}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg hover:opacity-90 transition">
              {t('startDraw')}
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="text-center text-purple-300/60 text-sm mb-4">{t('questionPrefix')}{result.question}</div>

          {/* 卡片展示区 */}
          <div className={`grid gap-4 ${result.cards?.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' : result.cards?.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
            {(result.cards || []).map((card, i) => (
              <motion.div key={i}
                initial={{ rotateY: 180, opacity: 0, scale: 0.8 }}
                animate={{
                  rotateY: revealedCards[i] ? 0 : 180,
                  opacity: 1,
                  scale: 1
                }}
                transition={{
                  delay: i * 0.3,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                className="relative"
                style={{ perspective: '1000px' }}>

                {/* 牌背 */}
                {!revealedCards[i] && (
                  <motion.div
                    className="card-glass rounded-xl p-4 text-center border border-purple-500/30"
                    style={{ backfaceVisibility: 'hidden' }}>
                    <div className="text-4xl mb-2">{cardBack}</div>
                    <div className="text-purple-300/50 text-xs">{t('cardBack')}</div>
                  </motion.div>
                )}

                {/* 牌面 */}
                {revealedCards[i] && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="card-glass rounded-xl p-4 text-center border border-purple-500/30">
                    <div className="text-4xl mb-2">{getCardEmoji(card)}</div>
                    <div className="text-purple-100 font-bold text-sm">{card.fullName || card.name}</div>
                    <div className="text-xs text-purple-300/50 mb-1">{card.position || spreadPositions[spread]?.[i] || `${t('position')}${i+1}`}</div>
                    <div className="text-xs text-purple-300/60 mt-1">
                      {card.suit} · {card.reversed ? t('reversed') : t('upright')}
                    </div>
                    <div className="text-xs text-yellow-300/80 mt-2 italic">{card.meaning}</div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* AI 解读 */}
          {!isAnimating && result.reading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-glass p-6 rounded-xl border border-purple-500/20">
              <h3 className="text-yellow-300 font-bold mb-3">🤖 {t('aiReadingTitle')}</h3>
              <MarkdownText text={result.reading} className="text-purple-200/80 text-sm leading-relaxed" />
            </motion.div>
          )}

          {/* 操作按钮 */}
          {!isAnimating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3">
              <SaveButton type="tarot" question={result.question} result={result} />
              <button onClick={resetReading}
                className="w-full py-3 rounded-xl bg-purple-800/50 text-purple-200 font-bold hover:bg-purple-700/50 transition">
                {t('newReading')}
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}
