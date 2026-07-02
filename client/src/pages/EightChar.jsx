import React, { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { AuthContext } from '../App'
import Dropdown from '../components/Dropdown'
import LoadingSpinner from '../components/LoadingSpinner'
import MarkdownText from '../components/MarkdownText'
import PaywallNotice from '../components/PaywallNotice'
import { getPaywallPayload, readApiJson } from '../utils/api'

const quickYears = [
  { year: 2000, desc: { zh: '千禧龙年', en: 'Millennium Dragon' } },
  { year: 1995, desc: { zh: '属猪', en: 'Year of Pig' } },
  { year: 1990, desc: { zh: '属马', en: 'Year of Horse' } },
  { year: 1985, desc: { zh: '属牛', en: 'Year of Ox' } },
  { year: 2010, desc: { zh: '属虎', en: 'Year of Tiger' } }
]

const hours = [
  { value: 0, zh: '子时(23-01)', en: 'Zi (23-01)' }, { value: 1, zh: '丑时(01-03)', en: 'Chou (01-03)' },
  { value: 2, zh: '寅时(03-05)', en: 'Yin (03-05)' }, { value: 3, zh: '卯时(05-07)', en: 'Mao (05-07)' },
  { value: 4, zh: '辰时(07-09)', en: 'Chen (07-09)' }, { value: 5, zh: '巳时(09-11)', en: 'Si (09-11)' },
  { value: 6, zh: '午时(11-13)', en: 'Wu (11-13)' }, { value: 7, zh: '未时(13-15)', en: 'Wei (13-15)' },
  { value: 8, zh: '申时(15-17)', en: 'Shen (15-17)' }, { value: 9, zh: '酉时(17-19)', en: 'You (17-19)' },
  { value: 10, zh: '戌时(19-21)', en: 'Xu (19-21)' }, { value: 11, zh: '亥时(21-23)', en: 'Hai (21-23)' }
]

const zodiacIcons = { '鼠':'🐭','牛':'🐂','虎':'🐅','兔':'🐇','龙':'🐉','蛇':'🐍','马':'🐴','羊':'🐑','猴':'🐒','鸡':'🐓','狗':'🐕','猪':'🐖' }

export default function EightChar() {
  const { t, i18n } = useTranslation('eight-char')
  const tc = useTranslation('common')
  const { user, token } = useContext(AuthContext)
  const lang = i18n.language?.startsWith('en') ? 'en' : 'zh'
  const [form, setForm] = useState({ year: '', month: '', day: '', hour: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [paywall, setPaywall] = useState(null)

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const now = new Date()
  const years = Array.from({ length: 80 }, (_, i) => now.getFullYear() - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  const doAnalysis = async () => {
    if (!form.year || !form.month || !form.day) { alert(t('pleaseSelect')); return }
    setLoading(true)
    setResult(null)
    setPaywall(null)
    try {
      const res = await fetch('/api/eight-characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ year: form.year, month: form.month, day: form.day, hour: form.hour || undefined, lang })
      })
      const data = await readApiJson(res)
      setResult(data)
    } catch (err) {
      const quota = getPaywallPayload(err)
      if (quota) setPaywall(quota)
      else alert(err.message || tc.t('common.error'))
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-100 mb-2">{t('title')}</h1>
        <p className="text-purple-300/60">{t('subtitle')}</p>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card-glass p-4 rounded-xl">
          <p className="text-sm text-purple-300/60 mb-3">{t('quickFill')}</p>
          <div className="flex flex-wrap gap-2">
            {quickYears.map(y => (
              <button key={y.year} onClick={() => setField('year', y.year)}
                className="px-3 py-1.5 rounded-lg bg-purple-900/30 text-sm text-purple-200/70 hover:bg-purple-800/40 transition">
                {y.year} <span className="text-purple-300/40 text-xs">{y.desc[lang]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card-glass p-6 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Dropdown label={t('birthYear')} value={form.year} onChange={v => setField('year', v)}
            placeholder={t('selectYear')}
            options={years.map(y => ({ value: y, label: `${y}${lang === 'en' ? '' : '年'}` }))} />
          <Dropdown label={t('birthMonth')} value={form.month} onChange={v => setField('month', v)}
            placeholder={t('selectMonth')}
            options={months.map(m => ({ value: m, label: `${m}${lang === 'en' ? '/M' : '月'}` }))} />
          <Dropdown label={t('birthDay')} value={form.day} onChange={v => setField('day', v)}
            placeholder={t('selectDay')}
            options={days.map(d => ({ value: d, label: `${d}${lang === 'en' ? '' : '日'}` }))} />
          <Dropdown label={t('birthHour')} value={form.hour} onChange={v => setField('hour', v)}
            placeholder={t('selectHour')}
            options={hours.map(h => ({ value: h.value, label: h[lang] }))} />
        </div>

          {loading ? (
            <LoadingSpinner text={t('analyzing')} icon="☯️" />
          ) : (
            <button onClick={doAnalysis}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-lg hover:opacity-90 transition">
              {t('startBtn')}
            </button>
          )}
          <PaywallNotice payload={paywall} user={user} token={token} />
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6 max-w-2xl mx-auto">
          <div className="card-glass p-6 rounded-xl">
            <div className="grid grid-cols-4 gap-3 text-center mb-4">
              {[t('yearPillar'), t('monthPillar'), t('dayPillar'), t('hourPillar')].map((label, i) => (
                <div key={i} className="bg-purple-900/30 rounded-lg p-3">
                  <div className="text-xs text-purple-300/60 mb-1">{label}</div>
                  <div className="text-yellow-300 font-bold">{result.pillars?.[i]}</div>
                </div>
              ))}
            </div>
          </div>

          {result.reading && (
            <div className="card-glass p-6 rounded-xl border border-purple-500/20">
              <h3 className="text-yellow-300 font-bold mb-3">🤖 AI {lang === 'en' ? 'Analysis' : '解读'}</h3>
              <MarkdownText text={result.reading} className="text-purple-200/80 text-sm leading-relaxed" />
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
