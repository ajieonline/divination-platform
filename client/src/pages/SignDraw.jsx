import React, { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { AuthContext } from '../App'
import Dropdown from '../components/Dropdown'
import LoadingSpinner from '../components/LoadingSpinner'
import MarkdownText from '../components/MarkdownText'

const signTypes = [
  { value: 'guanyin', icon: '🙏' },
  { value: 'guandi', icon: '⚔️' },
  { value: 'huagong', icon: '🦊' },
  { value: 'wenchang', icon: '📚' },
  { value: 'yuelao', icon: '💕' }
]

export default function SignDraw() {
  const { t, i18n } = useTranslation('sign')
  const tc = useTranslation('common')
  const { user, token } = useContext(AuthContext)
  const lang = i18n.language?.startsWith('en') ? 'en' : 'zh'
  const [type, setType] = useState('guanyin')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const typeNames = t('types', { returnObjects: true })
  const tryQuestions = t('tryQuestions', { returnObjects: true })

  const doDraw = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/sign/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ type, question: question || undefined, lang })
      })
      const data = await res.json()
      setResult(data)
    } catch (e) {}
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
            <Dropdown label={t('selectTypeLabel')} value={type} onChange={setType}
              placeholder={t('selectTypePlaceholder')}
              options={signTypes.map(s => ({ value: s.value, label: typeNames[s.value] || s.value, icon: s.icon }))} />

            <div className="card-glass p-4 rounded-xl mt-4">
              <p className="text-sm text-purple-300/50 mb-2">{t('quickQuestions')}</p>
              <div className="grid grid-cols-2 gap-2">
                {(Array.isArray(tryQuestions) ? tryQuestions : []).map((q, i) => (
                  <button key={i} onClick={() => setQuestion(q)}
                    className="text-left text-xs px-3 py-2 rounded-lg bg-purple-900/30 text-purple-200/60 hover:text-purple-100 hover:bg-purple-800/40 transition">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text={t('drawing')} icon="🎋" />
          ) : (
            <button onClick={doDraw}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold text-lg hover:opacity-90 transition">
              {t('startDraw')}
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
          <div className="card-glass p-6 rounded-xl border border-green-500/20 text-center">
            <div className="text-5xl mb-4">🎋</div>
            <h2 className="text-2xl font-bold text-yellow-300 mb-2">{result.title || result.poem}</h2>
            <div className="text-sm text-purple-300/60 mb-4">
              {typeNames[result.type] || result.type}
            </div>
            {result.meaning && (
              <p className="text-purple-200/80 text-sm leading-relaxed mb-4">{result.meaning}</p>
            )}
            {result.advice && (
              <div className="bg-purple-900/30 rounded-lg p-4 mt-4">
                <div className="text-yellow-300 font-bold text-sm mb-2">💡 {lang === 'en' ? 'Advice' : '建议'}</div>
                <p className="text-purple-200/70 text-sm">{result.advice}</p>
              </div>
            )}
          </div>

          {result.reading && (
            <div className="card-glass p-6 rounded-xl border border-purple-500/20">
              <h3 className="text-yellow-300 font-bold mb-3">{t('aiTitle')}</h3>
              <MarkdownText text={result.reading} className="text-purple-200/80 text-sm leading-relaxed" />
            </div>
          )}

          <button onClick={() => { setResult(null); setQuestion('') }}
            className="w-full py-3 rounded-xl bg-purple-800/50 text-purple-200 font-bold hover:bg-purple-700/50 transition">
            {t('newDraw')}
          </button>
        </motion.div>
      )}
    </div>
  )
}
