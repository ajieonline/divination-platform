import React, { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { AuthContext } from '../App'
import LoadingSpinner from '../components/LoadingSpinner'
import MarkdownText from '../components/MarkdownText'

const zodiacData = [
  { key: 'aries', emoji: '♈', dates: '3.21-4.19', element: 'fire', color: 'from-red-500 to-orange-600' },
  { key: 'taurus', emoji: '♉', dates: '4.20-5.20', element: 'earth', color: 'from-green-600 to-emerald-700' },
  { key: 'gemini', emoji: '♊', dates: '5.21-6.21', element: 'air', color: 'from-yellow-500 to-amber-600' },
  { key: 'cancer', emoji: '♋', dates: '6.22-7.22', element: 'water', color: 'from-blue-400 to-cyan-500' },
  { key: 'leo', emoji: '♌', dates: '7.23-8.22', element: 'fire', color: 'from-yellow-500 to-orange-500' },
  { key: 'virgo', emoji: '♍', dates: '8.23-9.22', element: 'earth', color: 'from-green-500 to-teal-600' },
  { key: 'libra', emoji: '♎', dates: '9.23-10.23', element: 'air', color: 'from-pink-400 to-rose-500' },
  { key: 'scorpio', emoji: '♏', dates: '10.24-11.22', element: 'water', color: 'from-red-700 to-purple-800' },
  { key: 'sagittarius', emoji: '♐', dates: '11.23-12.21', element: 'fire', color: 'from-purple-500 to-indigo-600' },
  { key: 'capricorn', emoji: '♑', dates: '12.22-1.19', element: 'earth', color: 'from-gray-600 to-gray-800' },
  { key: 'aquarius', emoji: '♒', dates: '1.20-2.18', element: 'air', color: 'from-cyan-400 to-blue-500' },
  { key: 'pisces', emoji: '♓', dates: '2.19-3.20', element: 'water', color: 'from-blue-500 to-purple-600' }
]

const elementColors = { fire: 'text-red-400', earth: 'text-green-400', air: 'text-yellow-400', water: 'text-blue-400' }
const elementLabels = { fire: { zh: '火', en: 'Fire' }, earth: { zh: '土', en: 'Earth' }, air: { zh: '风', en: 'Air' }, water: { zh: '水', en: 'Water' } }

export default function Zodiac() {
  const { t, i18n } = useTranslation('zodiac')
  const tc = useTranslation('common')
  const { user, token } = useContext(AuthContext)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const lang = i18n.language?.startsWith('en') ? 'en' : 'zh'

  const zodiacNames = {
    aries: { zh: '白羊座', en: 'Aries' }, taurus: { zh: '金牛座', en: 'Taurus' },
    gemini: { zh: '双子座', en: 'Gemini' }, cancer: { zh: '巨蟹座', en: 'Cancer' },
    leo: { zh: '狮子座', en: 'Leo' }, virgo: { zh: '处女座', en: 'Virgo' },
    libra: { zh: '天秤座', en: 'Libra' }, scorpio: { zh: '天蝎座', en: 'Scorpio' },
    sagittarius: { zh: '射手座', en: 'Sagittarius' }, capricorn: { zh: '摩羯座', en: 'Capricorn' },
    aquarius: { zh: '水瓶座', en: 'Aquarius' }, pisces: { zh: '双鱼座', en: 'Pisces' }
  }

  const getName = (z) => zodiacNames[z.key]?.[lang] || zodiacNames[z.key]?.zh

  const doDivination = async (z) => {
    setSelected(z)
    setLoading(true)
    setResult(null)
    try {
      const signName = getName(z)
      const res = await fetch(`/api/zodiac/${encodeURIComponent(signName)}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      })
      const data = await res.json()
      setResult(data)
    } catch (e) {}
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-100 mb-2">{t('title')}</h1>
        <p className="text-purple-300/60">{t('subtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        {zodiacData.map(z => (
          <motion.button key={z.key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => doDivination(z)}
            className={`card-glass rounded-xl p-3 text-center border-2 transition-all ${selected?.key === z.key ? 'border-purple-400' : 'border-transparent'}`}>
            <div className="text-3xl mb-1">{z.emoji}</div>
            <div className="text-purple-100 font-bold text-xs">{getName(z)}</div>
            <div className="text-purple-300/40 text-xs">{z.dates}</div>
          </motion.button>
        ))}
      </div>

      {loading && <LoadingSpinner text={t('readingStars')} icon={selected?.emoji || '⭐'} />}

      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="card-glass p-6 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{selected.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold text-yellow-300">{t('todayFortune', { name: getName(selected) })}</h2>
                <div className={`text-sm ${elementColors[selected.element]}`}>
                  {elementLabels[selected.element][lang]}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-purple-900/30 rounded-lg p-3 text-center">
                <div className="text-purple-300/60 text-xs mb-1">{t('overall')}</div>
                <div className="text-yellow-400 text-lg">{'⭐'.repeat(result.overall || 5)}</div>
              </div>
              {[
                { key: 'love', emoji: '💕' }, { key: 'career', emoji: '💼' },
                { key: 'wealth', emoji: '💰' }, { key: 'health', emoji: '🏥' }
              ].map(item => (
                <div key={item.key} className="bg-purple-900/30 rounded-lg p-3 text-center">
                  <div className="text-purple-300/60 text-xs mb-1">{t(item.key)}</div>
                  <div className="text-sm text-purple-100">{item.emoji} {'⭐'.repeat(result[item.key] || 3)}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
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
