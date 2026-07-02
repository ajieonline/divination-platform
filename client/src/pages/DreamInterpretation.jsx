import React, { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { AuthContext } from '../App'
import Dropdown from '../components/Dropdown'
import LoadingSpinner from '../components/LoadingSpinner'
import MarkdownText from '../components/MarkdownText'
import PaywallNotice from '../components/PaywallNotice'
import { getPaywallPayload, readApiJson } from '../utils/api'

const dreamCategories = [
  { value: 'nature', icon: '🌊', keywords: ['water','fire','rain','snow','wind','thunder','eclipse','rainbow','earthquake'] },
  { value: 'animals', icon: '🐉', keywords: ['snake','fish','dragon','tiger','lion','dog','cat','bird','butterfly','turtle'] },
  { value: 'body', icon: '🦷', keywords: ['teeth','hair','blood','eyes','hands','feet','pregnancy','death','tears','skin'] },
  { value: 'life', icon: '🏠', keywords: ['wedding','exam','school','moving','cooking','photo','travel','work','argument','breakup'] },
  { value: 'objects', icon: '💎', keywords: ['money','coffin','mirror','flower','tree','knife','shoes','clothes','phone','car'] },
  { value: 'people', icon: '👤', keywords: ['dead person','child','pregnant woman','elderly','stranger','lover','parents','friend','enemy','ghost'] }
]

const dreamKeywordsCN = {
  nature: ['水','火','雨','雪','风','雷','日食','月食','彩虹','地震'],
  animals: ['蛇','鱼','龙','老虎','狮子','狗','猫','鸟','蝴蝶','乌龟'],
  body: ['牙齿','头发','血','眼睛','手','脚','怀孕','死亡','眼泪','皮肤'],
  life: ['结婚','考试','上学','搬家','做饭','拍照','旅行','上班','吵架','分手'],
  objects: ['钱','棺材','镜子','花','树','刀','鞋','衣服','手机','车'],
  people: ['死人','小孩','孕妇','老人','陌生人','恋人','父母','朋友','敌人','鬼']
}

export default function DreamInterpretation() {
  const { t, i18n } = useTranslation('dream')
  const tc = useTranslation('common')
  const { user, token } = useContext(AuthContext)
  const lang = i18n.language?.startsWith('en') ? 'en' : 'zh'
  const [category, setCategory] = useState('nature')
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [paywall, setPaywall] = useState(null)

  const catLabels = t('categories', { returnObjects: true })
  const currentKeywords = lang === 'en'
    ? (dreamCategories.find(c => c.value === category)?.keywords || [])
    : (dreamKeywordsCN[category] || [])

  const doInterpret = async () => {
    if (!keyword.trim()) { alert(t('error')); return }
    setLoading(true)
    setResult(null)
    setPaywall(null)
    try {
      const res = await fetch('/api/dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ keyword: keyword.trim(), lang })
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

      {!result ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
          <div className="card-glass p-6 rounded-xl">
            <Dropdown label={t('categoryLabel')} value={category}
              onChange={v => { setCategory(v); setKeyword('') }}
              placeholder={t('categoryPlaceholder')}
              options={dreamCategories.map(c => ({ value: c.value, label: catLabels[c.value] || c.value, icon: c.icon }))} />

            <div className="grid grid-cols-5 gap-2 mt-4">
              {currentKeywords.map((kw, i) => (
                <button key={i} onClick={() => setKeyword(kw)}
                  className={`text-xs px-2 py-2 rounded-lg transition ${keyword === kw ? 'bg-purple-600 text-white' : 'bg-purple-900/30 text-purple-200/60 hover:bg-purple-800/40'}`}>
                  {kw}
                </button>
              ))}
            </div>
            <p className="text-sm text-purple-300/50 mt-3">{t('quickKeywords')}</p>
          </div>

          <input type="text" className="input-mystic w-full" placeholder={t('subtitle')}
            value={keyword} onChange={e => setKeyword(e.target.value)} />

          {loading ? (
            <LoadingSpinner text={t('analyzing')} icon="🌙" />
          ) : (
            <button onClick={doInterpret}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg hover:opacity-90 transition">
              {t('startInterpret')}
            </button>
          )}
          <PaywallNotice payload={paywall} user={user} token={token} />
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
          <div className="card-glass p-6 rounded-xl border border-indigo-500/20">
            <h2 className="text-2xl font-bold text-yellow-300 mb-2">{t('dreamKeyword', { keyword: result.keyword })}</h2>
          </div>

          {result.reading && (
            <div className="card-glass p-6 rounded-xl border border-purple-500/20">
              <h3 className="text-yellow-300 font-bold mb-3">{t('aiTitle')}</h3>
              <MarkdownText text={result.reading} className="text-purple-200/80 text-sm leading-relaxed" />
            </div>
          )}

          <button onClick={() => { setResult(null); setKeyword('') }}
            className="w-full py-3 rounded-xl bg-purple-800/50 text-purple-200 font-bold hover:bg-purple-700/50 transition">
            {t('newDream')}
          </button>
        </motion.div>
      )}
    </div>
  )
}
