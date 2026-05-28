import React, { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { AuthContext } from '../App'
import Dropdown from '../components/Dropdown'
import LoadingSpinner from '../components/LoadingSpinner'
import MarkdownText from '../components/MarkdownText'

const monthIcons = ['❄️','❄️','🌸','🌸','🌿','☀️','☀️','🌺','🍂','🍂','❄️','❄️']

export default function DailyFortune() {
  const { t, i18n } = useTranslation('daily')
  const tc = useTranslation('common')
  const { user, token } = useContext(AuthContext)
  const lang = i18n.language?.startsWith('en') ? 'en' : 'zh'
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [day, setDay] = useState(now.getDate())
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  const doFortune = async () => {
    if (!month || !day) { alert(t('error')); return }
    setLoading(true)
    try {
      const res = await fetch('/api/daily-fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ month, day, lang })
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

      <div className="max-w-md mx-auto space-y-6">
        <div className="card-glass p-6 rounded-xl grid grid-cols-2 gap-4">
          <Dropdown label={t('birthdayMonth')} value={month} onChange={setMonth}
            placeholder={t('selectMonth')}
            options={months.map((m, i) => ({ value: m, label: `${m}${lang === 'en' ? '' : '月'}`, icon: monthIcons[i] }))} />
          <Dropdown label={t('birthdayDay')} value={day} onChange={setDay}
            placeholder={t('selectDay')}
            options={days.map(d => ({ value: d, label: `${d}${lang === 'en' ? '' : '日'}` }))} />
        </div>

        <button onClick={() => { setMonth(now.getMonth() + 1); setDay(now.getDate()) }}
          className="w-full py-2 rounded-lg bg-purple-900/30 text-purple-200/60 text-sm hover:bg-purple-800/40 transition">
          {t('todayDate', { month: now.getMonth() + 1, day: now.getDate() })}
        </button>

        {loading ? (
          <LoadingSpinner text={t('viewing')} icon="⭐" />
        ) : (
          <button onClick={doFortune}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg hover:opacity-90 transition">
            {t('startView')}
          </button>
        )}
      </div>

      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto mt-8 space-y-6">
          <div className="card-glass p-6 rounded-xl border border-amber-500/20">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4 text-center">{t('zodiacFortune', { zodiac: result.zodiac })}</h2>

            <div className="bg-purple-900/30 rounded-lg p-4 mb-4">
              <div className="text-sm text-purple-300/60 mb-2">{t('overallLabel')}</div>
              <div className="text-yellow-400 text-lg">{'⭐'.repeat(result.overall || 5)}</div>
            </div>

            <h3 className="text-lg font-bold text-yellow-300 mb-4 text-center">{t('aspectsTitle')}</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { key: 'love', emoji: '💕' }, { key: 'career', emoji: '💼' },
                { key: 'wealth', emoji: '💰' }, { key: 'health', emoji: '🏥' }
              ].map(item => (
                <div key={item.key} className="bg-purple-900/30 rounded-lg p-3">
                  <div className="text-xs text-purple-300/60 mb-1">{item.emoji} {t(item.key)}</div>
                  <div className="text-sm text-purple-100">{'⭐'.repeat(result[item.key] || 3)}</div>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold text-yellow-300 mb-4 text-center">{t('luckyGuide')}</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'luckyNumber', val: result.luckyNumber },
                { key: 'luckyColor', val: result.luckyColor },
                { key: 'luckyDirection', val: result.luckyDirection }
              ].map(item => (
                <div key={item.key} className="bg-purple-900/20 rounded-lg p-3 text-center">
                  <div className="text-xs text-purple-300/60 mb-1">{t(item.key)}</div>
                  <div className="text-sm text-yellow-300 font-bold">{item.val}</div>
                </div>
              ))}
            </div>
          </div>

          {result.reading && (
            <div className="card-glass p-6 rounded-xl border border-purple-500/20">
              <h3 className="text-yellow-300 font-bold mb-3">🤖 AI {t('aiAnalysis')}</h3>
              <MarkdownText text={result.reading} className="text-purple-200/80 text-sm leading-relaxed" />
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
