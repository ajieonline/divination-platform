import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SaveButton from '../components/SaveButton'
import { motion, AnimatePresence } from 'framer-motion'
import Dropdown from '../components/Dropdown'
import LoadingSpinner from '../components/LoadingSpinner'
import MarkdownText from '../components/MarkdownText'

const quickNames = {
  zh: ['李明', '王芳', '张伟', '刘洋', '陈静', '赵磊', '周杰', '吴娜'],
  en: ['Li Ming', 'Wang Fang', 'Zhang Wei', 'Liu Yang', 'Chen Jing', 'Zhao Lei', 'Zhou Jie', 'Wu Na']
}

export default function NameTest() {
  const { t, i18n } = useTranslation('name')
  const tc = useTranslation('common')
  const lang = i18n.language?.startsWith('en') ? 'en' : 'zh'
  const [mode, setMode] = useState('single')
  const [name, setName] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    if (!name.trim()) { alert(lang === 'en' ? 'Please enter a name' : '请输入姓名'); return }
    if (mode === 'partner' && !partnerName.trim()) { alert(lang === 'en' ? 'Please enter partner name' : '请输入对方姓名'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), partnerName: mode === 'partner' ? partnerName.trim() : undefined, lang })
      })
      setResult(await res.json())
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-300 to-yellow-300 bg-clip-text text-transparent">
          📝 {t('title')}
        </h1>
        <p className="text-center text-purple-300/60 mb-8">{t('subtitle')}</p>

        <div className="card-glass p-8 max-w-lg mx-auto mb-8">
          <div className="flex gap-3 mb-6">
            <button onClick={() => setMode('single')}
              className="flex-1 py-3 rounded-xl text-sm transition-all"
              style={{
                background: mode === 'single' ? 'linear-gradient(135deg, #a21caf, #7c3aed)' : 'rgba(30,15,60,0.6)',
                border: `1px solid ${mode === 'single' ? 'rgba(217,70,239,0.6)' : 'rgba(217,70,239,0.2)'}`,
                color: mode === 'single' ? 'white' : 'rgba(196,181,253,0.7)'
              }}>
              🧑 {t('singleMode')}
            </button>
            <button onClick={() => setMode('partner')}
              className="flex-1 py-3 rounded-xl text-sm transition-all"
              style={{
                background: mode === 'partner' ? 'linear-gradient(135deg, #a21caf, #7c3aed)' : 'rgba(30,15,60,0.6)',
                border: `1px solid ${mode === 'partner' ? 'rgba(217,70,239,0.6)' : 'rgba(217,70,239,0.2)'}`,
                color: mode === 'partner' ? 'white' : 'rgba(196,181,253,0.7)'
              }}>
              💕 {t('partnerMode')}
            </button>
          </div>

          <p className="text-sm text-purple-300/50 mb-2">⚡ {t('quickFill')}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {quickNames[lang].map(n => (
              <button key={n} onClick={() => setName(n)}
                className="px-3 py-1.5 rounded-lg text-sm transition-all"
                style={{
                  background: name === n ? 'linear-gradient(135deg, #a21caf, #7c3aed)' : 'rgba(30,15,60,0.6)',
                  border: `1px solid ${name === n ? 'rgba(217,70,239,0.6)' : 'rgba(217,70,239,0.2)'}`,
                  color: name === n ? 'white' : 'rgba(196,181,253,0.7)'
                }}>
                {n}
              </button>
            ))}
          </div>

          <input type="text" className="input-mystic w-full mb-3" placeholder={t('namePlaceholder')} value={name} onChange={e => setName(e.target.value)} />

          {mode === 'partner' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <p className="text-sm text-purple-300/50 mb-2">{t('partnerQuickFill')}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {quickNames[lang].map(n => (
                  <button key={n} onClick={() => setPartnerName(n)}
                    className="px-3 py-1.5 rounded-lg text-sm transition-all"
                    style={{
                      background: partnerName === n ? 'linear-gradient(135deg, #a21caf, #7c3aed)' : 'rgba(30,15,60,0.6)',
                      border: `1px solid ${partnerName === n ? 'rgba(217,70,239,0.6)' : 'rgba(217,70,239,0.2)'}`,
                      color: partnerName === n ? 'white' : 'rgba(196,181,253,0.7)'
                    }}>
                    {n}
                  </button>
                ))}
              </div>
              <input type="text" className="input-mystic w-full mb-3" placeholder={t('partnerPlaceholder')} value={partnerName} onChange={e => setPartnerName(e.target.value)} />
            </motion.div>
          )}

          {loading ? (
            <LoadingSpinner text={t('analyzing')} icon="📝" />
          ) : (
            <button onClick={analyze} disabled={!name.trim()}
              className="btn-gold w-full disabled:opacity-40 disabled:cursor-not-allowed">
              📝 {t('startBtn')}
            </button>
          )}
        </div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
              <div className="card-glass p-8 text-center">
                <h2 className="text-2xl font-bold text-yellow-300 mb-2">{result.name}</h2>
                <div className="text-sm text-purple-300/60 mb-4">
                  {t('totalStrokes')} {result.totalStrokes} · {t('element')} {result.element} · {result.luck}
                </div>
                {result.fiveGrid && (
                  <div className="flex justify-center gap-4 mb-4">
                    {[{k:'heaven',l:t('tianGe')},{k:'human',l:t('renGe')},{k:'earth',l:t('diGe')}].map(g => (
                      <div key={g.k} className="text-center">
                        <div className="text-xs text-purple-300/50">{g.l}</div>
                        <div className="text-yellow-300 font-bold">{result.fiveGrid[g.k]}</div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-purple-200/80 text-sm">{result.personality}</p>
              </div>

              {result.compatibility && (
                <div className="card-glass p-6">
                  <h3 className="text-yellow-300 font-bold mb-3 text-center">💕 {t('compatTitle')}</h3>
                  <div className="text-center mb-4">
                    <div className="text-5xl font-bold text-yellow-300">{result.match}%</div>
                    <div className="text-sm text-purple-300/60">{t('compatIndex')}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-xl" style={{background: 'rgba(251,191,36,0.1)'}}>
                      <div className="text-xs text-purple-300/50 mb-1">{result.name}</div>
                      <div className="text-sm text-purple-200/80">{t('element')} {result.element}</div>
                    </div>
                    <div className="text-center p-3 rounded-xl" style={{background: 'rgba(251,191,36,0.1)'}}>
                      <div className="text-xs text-purple-300/50 mb-1">{result.compatibility.name}</div>
                      <div className="text-sm text-purple-200/80">{t('element')} {result.compatibility.element}</div>
                    </div>
                  </div>
                </div>
              )}

              {result.aiAnalysis && (
                <div className="card-glass p-6">
                  <h3 className="text-yellow-300 font-bold mb-3">🤖 {t('aiTitle')}</h3>
                  <MarkdownText text={result.aiAnalysis} className="text-purple-200/80 text-sm leading-relaxed" />
                </div>
              )}

              <div className="mt-6"><SaveButton type="name" question={name + (partnerName ? '&'+partnerName : '')} result={result} /></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
