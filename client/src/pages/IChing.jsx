import React, { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { AuthContext } from '../App'
import Dropdown from '../components/Dropdown'
import LoadingSpinner from '../components/LoadingSpinner'
import MarkdownText from '../components/MarkdownText'
import PaywallNotice from '../components/PaywallNotice'
import { getPaywallPayload, readApiJson } from '../utils/api'

const categories = [
  { value: 'career', icon: '💼' },
  { value: 'love', icon: '💕' },
  { value: 'wealth', icon: '💰' },
  { value: 'health', icon: '🏥' },
  { value: 'study', icon: '📚' },
  { value: 'life', icon: '🌿' }
]

export default function IChing() {
  const { t, i18n } = useTranslation('iching')
  const { user, token } = useContext(AuthContext)
  const lang = i18n.language?.startsWith('en') ? 'en' : 'zh'
  const [category, setCategory] = useState('career')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [paywall, setPaywall] = useState(null)

  const catLabels = t('questionTypes', { returnObjects: true })
  const catOptions = t('categoryOptions', { returnObjects: true })

  const quickQ = Array.isArray(catOptions[category]) ? catOptions[category] : []

  const doDivination = async () => {
    setLoading(true)
    setResult(null)
    setPaywall(null)
    try {
      const res = await fetch('/api/iching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ question: question || (quickQ[0]) || 'General fortune', category, lang })
      })
      const data = await readApiJson(res)
      setResult(data)
    } catch (err) {
      const quota = getPaywallPayload(err)
      if (quota) setPaywall(quota)
      else alert(err.message || t('networkError'))
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-100 mb-2">{t('title')}</h1>
        <p className="text-purple-300/60">{t('subtitle')}</p>
      </motion.div>

      {!result ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
          <div className="card-glass p-6 rounded-xl">
            <Dropdown label={t('selectQuestionType')} value={category}
              onChange={v => { setCategory(v); setQuestion('') }}
              placeholder={t('selectField')}
              options={categories.map(c => ({ value: c.value, label: catLabels[c.value] || c.value, icon: c.icon }))} />

            <div className="grid grid-cols-2 gap-2 mt-4">
              {quickQ.map((q, i) => (
                <button key={i} onClick={() => setQuestion(q)}
                  className="text-left text-xs px-3 py-2 rounded-lg bg-purple-900/30 text-purple-200/60 hover:text-purple-100 hover:bg-purple-800/40 transition">
                  {q}
                </button>
              ))}
            </div>
          </div>

          <input type="text" className="input-mystic w-full" placeholder={t('inputQuestion')}
            value={question} onChange={e => setQuestion(e.target.value)} />

          {loading ? (
            <LoadingSpinner text={t('divining')} icon="☯️" />
          ) : (
            <button onClick={doDivination}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-red-600 text-white font-bold text-lg hover:opacity-90 transition">
              {t('startDivination')}
            </button>
          )}
          <PaywallNotice payload={paywall} user={user} token={token} />
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
          <div className="card-glass p-6 rounded-xl border border-yellow-500/20">
            <h2 className="text-2xl font-bold text-yellow-300 text-center mb-2">{result.hexagram}</h2>
            <p className="text-purple-200/80 text-sm mb-3 text-center">{result.meaning}</p>
            <p className="text-purple-200/80 text-sm mb-3">{result.upper} · {result.lower}</p>
            {result.lines && (
              <div className="flex gap-2 justify-center mb-3">
                {result.lines.map((l, i) => (
                  <div key={i} className="text-xs text-purple-300/40">
                    {i + 1}{t('lineLabel')} {l.type}{l.changing ? ' (动爻)' : ''}
                  </div>
                ))}
              </div>
            )}
            {result.question && <p className="text-sm text-purple-300/50 mt-2">{t('questionPrefix')}{result.question}</p>}
          </div>

          {result.reading && (
            <div className="card-glass p-6 rounded-xl border border-purple-500/20">
              <h3 className="text-yellow-300 font-bold mb-3">{t('aiTitle')}</h3>
              <MarkdownText text={result.reading} className="text-purple-200/80 text-sm leading-relaxed" />
            </div>
          )}

          <button onClick={() => { setResult(null); setQuestion('') }}
            className="w-full py-3 rounded-xl bg-purple-800/50 text-purple-200 font-bold hover:bg-purple-700/50 transition">
            {t('newDivination')}
          </button>
        </motion.div>
      )}
    </div>
  )
}
