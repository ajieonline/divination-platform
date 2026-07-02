import React, { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { AuthContext } from '../App'
import Dropdown from '../components/Dropdown'
import LoadingSpinner from '../components/LoadingSpinner'
import MarkdownText from '../components/MarkdownText'
import PaywallNotice from '../components/PaywallNotice'
import { getPaywallPayload, readApiJson } from '../utils/api'

const monthIcons = ['❄️','❄️','🌸','🌸','🌿','☀️','☀️','🌺','🍂','🍂','❄️','❄️']
const luckScoreMap = { '大吉': 5, '吉': 4, '中吉': 4, '小吉': 3, '平': 3 }

const getScore = (value, fallback = 4) => {
  if (typeof value === 'string' && luckScoreMap[value]) return luckScoreMap[value]
  const score = Number(value)
  if (!Number.isFinite(score)) return fallback
  return Math.max(1, Math.min(5, Math.round(score)))
}

const getStars = (value, fallback) => '⭐'.repeat(getScore(value, fallback))
const getText = (value) => typeof value === 'string' && Number.isNaN(Number(value)) ? value : ''

export default function DailyFortune() {
  const { t, i18n } = useTranslation('daily')
  const { user, token } = useContext(AuthContext)
  const lang = i18n.language?.startsWith('en') ? 'en' : 'zh'
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [day, setDay] = useState(now.getDate())
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [paywall, setPaywall] = useState(null)

  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  const doFortune = async () => {
    if (!month || !day) { alert(t('error')); return }
    setLoading(true)
    setResult(null)
    setPaywall(null)
    try {
      const res = await fetch('/api/daily-fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ month, day, lang })
      })
      const data = await readApiJson(res)
      setResult(data)
    } catch (err) {
      const quota = getPaywallPayload(err)
      if (quota) setPaywall(quota)
      else alert(err.message || t('error'))
    }
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
        <PaywallNotice payload={paywall} user={user} token={token} />
      </div>

      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto mt-8 space-y-6">
          <div className="card-glass p-6 rounded-xl border border-amber-500/20">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4 text-center">{t('zodiacFortune', { zodiac: result.zodiac })}</h2>

            <div className="bg-purple-900/30 rounded-lg p-4 mb-4">
              <div className="text-sm text-purple-300/60 mb-2">{t('overallLabel')}</div>
              <div className="text-yellow-400 text-lg">{getStars(result.luckScore || result.luck, 4)}</div>
              {result.luck && <div className="text-xs text-amber-200/80 mt-1">{result.luck}</div>}
              {getText(result.overall) && <p className="text-sm text-purple-100/80 leading-relaxed mt-3">{result.overall}</p>}
            </div>

            <h3 className="text-lg font-bold text-yellow-300 mb-4 text-center">{t('aspectsTitle')}</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { key: 'love', scoreKey: 'loveScore', emoji: '💕' }, { key: 'career', scoreKey: 'careerScore', emoji: '💼' },
                { key: 'wealth', scoreKey: 'wealthScore', emoji: '💰' }, { key: 'health', scoreKey: 'healthScore', emoji: '🏥' }
              ].map(item => (
                <div key={item.key} className="bg-purple-900/30 rounded-lg p-3">
                  <div className="text-xs text-purple-300/60 mb-1">{item.emoji} {t(item.key)}</div>
                  <div className="text-sm text-purple-100">{getStars(result[item.scoreKey], 3)}</div>
                  {getText(result[item.key]) && <p className="text-xs text-purple-200/68 leading-relaxed mt-2">{result[item.key]}</p>}
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
