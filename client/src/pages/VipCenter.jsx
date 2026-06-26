import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../App'
import LoginPrompt from '../components/LoginPrompt'
import { useTranslation } from 'react-i18next'

export default function VipCenter() {
  const { t, i18n } = useTranslation('vip')
  const tc = useTranslation('common')
  const lang = i18n.language?.startsWith('en') ? 'en' : 'zh'
  const { user, token } = useContext(AuthContext)
  const [points, setPoints] = useState(0)
  const [checkedIn, setCheckedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('plans')
  const [showLogin, setShowLogin] = useState(false)
  const [checkinLoading, setCheckinLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const showToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    if (user && token) {
      fetch('/api/user/checkin/status', { headers: { Authorization: 'Bearer ' + token } })
        .then(r => r.json()).then(d => {
          if (d.checkedIn) setCheckedIn(true)
          if (d.totalPoints !== undefined) setPoints(d.totalPoints)
        }).catch(() => {
          fetch('/api/user/points', { headers: { Authorization: 'Bearer ' + token } })
            .then(r => r.json()).then(d => { if (d.points !== undefined) setPoints(d.points) }).catch(() => {})
        })
    }
  }, [user, token])

  const handleCheckin = async () => {
    if (!user) { setShowLogin(true); return }
    setCheckinLoading(true)
    try {
      const res = await fetch('/api/user/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
      })
      const data = await res.json()
      if (res.ok) {
        setCheckedIn(true)
        setPoints(data.totalPoints || points + 10)
        showToast(t('checkinSuccess', { points: data.points || 10 }), 'success')
      } else if (data.error) {
        setCheckedIn(true)
        showToast(t('alreadyCheckedIn'), 'info')
      } else {
        showToast(t('checkinFailed'), 'error')
      }
      if (token) {
        fetch('/api/user/checkin/status', { headers: { Authorization: 'Bearer ' + token } })
          .then(r => r.json()).then(d => {
            if (d.checkedIn) setCheckedIn(true)
            if (d.totalPoints !== undefined) setPoints(d.totalPoints)
          }).catch(() => {})
      }
    } catch (e) {
      showToast(t('networkError'), 'error')
    }
    setCheckinLoading(false)
  }

  const handleRedeem = async (cost, name, itemKey) => {
    if (!user) { setShowLogin(true); return }
    if (points < cost) { alert(t('insufficientPoints')); return }
    try {
      const res = await fetch('/api/user/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ item: name, itemKey })
      })
      const data = await res.json()
      if (res.ok) { setPoints(data.remainingPoints || points - cost); alert(t('redeemSuccess')) }
      else alert(data.error || t('redeemFailed'))
    } catch (e) { alert(t('networkError')) }
  }

  const plansData = [
    { key: 'monthly', price: '29.9', period: '30', perDay: '1.00', original: '59.9', color: 'from-purple-600 to-indigo-600' },
    { key: 'quarterly', price: '69.9', period: '90', perDay: '0.78', original: '179.7', tag: true, color: 'from-pink-600 to-rose-600' },
    { key: 'yearly', price: '199', period: '365', perDay: '0.55', original: '718.8', color: 'from-yellow-500 to-amber-600' }
  ]

  const featuresData = {
    monthly: [t('features.unlimited'), t('features.deepReport'), t('features.cloudHistory'), t('features.doublePoints')],
    quarterly: [t('features.monthlyAll'), t('features.vipConsult'), t('features.birthdayFree'), t('features.priorityAccess')],
    yearly: [t('features.quarterlyAll'), t('features.freeSalon'), t('features.customReport'), t('features.vipSupport')]
  }

  const testimonials = [
    { name: t('reviews.xiaoyu.name'), avatar: '🌙', text: t('reviews.xiaoyu.text'), rating: 5 },
    { name: t('reviews.xingchen.name'), avatar: '⭐', text: t('reviews.xingchen.text'), rating: 5 },
    { name: t('reviews.nuannuan.name'), avatar: '☀️', text: t('reviews.nuannuan.text'), rating: 5 }
  ]

  const compareFeatures = t('compareFeatures', { returnObjects: true })
  const earnMethods = t('earnMethods', { returnObjects: true })
  const redeemItems = t('redeemItems', { returnObjects: true })
  const redeemKeys = ['tarot_single', 'bazi_deep', 'vip_month', 'fortune_report']

  const tabs = [
    { id: 'plans', label: t('tabPlans') },
    { id: 'compare', label: t('tabCompare') },
    { id: 'points', label: t('tabPoints') },
    { id: 'reviews', label: t('tabReviews') }
  ]

  return (
    <div className="min-h-screen">
      <LoginPrompt show={showLogin} onClose={() => setShowLogin(false)} message={t('loginPrompt')} />
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-bold shadow-lg transition-all animate-bounce ${
          toast.type === 'success' ? 'bg-green-500 text-white' : toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
        }`}>{toast.msg}</div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4" style={{background: 'linear-gradient(135deg, rgba(88,28,135,0.4), rgba(30,27,75,0.6))'}}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({length:20}).map((_,i) => (
            <div key={i} className="absolute rounded-full bg-yellow-400/20 animate-pulse"
              style={{width: Math.random()*8+4+'px', height: Math.random()*8+4+'px', left: Math.random()*100+'%', top: Math.random()*100+'%', animationDelay: Math.random()*3+'s', animationDuration: Math.random()*2+2+'s'}} />
          ))}
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 mb-6">
            <span className="text-2xl">👑</span>
            <span className="text-sm text-yellow-400 font-bold">{t('vipCenter')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('heroTitle')}<span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"> {t('heroHighlight')} </span>
          </h1>
          <p className="text-gray-300 text-lg mb-8">{t('heroSubtitle')}</p>
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center"><div className="text-2xl font-bold text-yellow-400">100+</div><div className="text-xs text-gray-400">{t('statMethods')}</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-yellow-400">{lang === 'en' ? '500K+' : '50万+'}</div><div className="text-xs text-gray-400">{t('statUsers')}</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-yellow-400">98%</div><div className="text-xs text-gray-400">{t('statRate')}</div></div>
          </div>
          {!user && (
            <button onClick={() => setShowLogin(true)} className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-bold text-lg hover:opacity-90 transition shadow-lg shadow-yellow-400/20">
              🎉 {t('registerFree')}
            </button>
          )}
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-30 bg-[#0a0014]/90 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto flex justify-center gap-1 px-4 py-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => {
              if (tab.id === 'points' && !user) { setShowLogin(true); return }
              setActiveTab(tab.id)
            }} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.id ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'plans' && (
          <div className="grid md:grid-cols-3 gap-6">
            {plansData.map((plan, i) => (
              <div key={i} className={`rounded-2xl border p-6 relative transition-all hover:scale-105 ${plan.tag ? 'border-yellow-400/50 shadow-lg shadow-yellow-400/10' : 'border-white/10 bg-white/5'}`} style={!plan.tag ? {background: 'rgba(255,255,255,0.03)'} : {background: 'linear-gradient(135deg, rgba(251,191,36,0.05), rgba(162,28,175,0.05))'}}>
                {plan.tag && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-pink-400 text-black text-xs font-bold rounded-full">{t('bestValue')}</div>}
                <div className="text-center mb-6">
                  <div className={`inline-block px-3 py-1 rounded-lg text-sm font-bold text-white mb-3 bg-gradient-to-r ${plan.color}`}>{t(`planNames.${plan.key}`)}</div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">¥{plan.price}</span>
                    <span className="text-gray-400 text-sm">/{plan.period}{lang === 'en' ? 'd' : '天'}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    <span className="line-through">¥{plan.original}</span>
                    <span className="ml-1 text-green-400">{t('perDay')} ¥{plan.perDay}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {(featuresData[plan.key] || []).map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => { if (!user) { setShowLogin(true); return } alert(t("comingSoon")) }}
                  className={`w-full py-3 rounded-xl font-bold text-white transition ${plan.tag ? 'bg-gradient-to-r from-yellow-400 to-pink-500 hover:opacity-90' : 'bg-purple-500 hover:bg-purple-600'}`}>
                  {user ? t('activateNow') : t('loginToActivate')}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="rounded-2xl border border-white/10 overflow-hidden" style={{background: 'rgba(255,255,255,0.03)'}}>
            <div className="grid grid-cols-3 gap-px bg-white/10 text-center">
              <div className="bg-[#0a0014] py-3 font-bold text-gray-400">{t('compareHeaders.feature')}</div>
              <div className="bg-[#0a0014] py-3 font-bold text-gray-400">{t('compareHeaders.free')}</div>
              <div className="bg-gradient-to-r from-yellow-400/20 to-pink-400/20 py-3 font-bold text-yellow-400">👑 VIP</div>
            </div>
            {Array.isArray(compareFeatures) && compareFeatures.map((item, i) => (
              <div key={i} className="grid grid-cols-3 gap-px bg-white/5">
                <div className="py-3 px-4 text-sm text-purple-200 bg-[#0a0014]">{item.feature}</div>
                <div className="py-3 px-4 text-sm text-gray-400 bg-[#0a0014] text-center">{item.free}</div>
                <div className="py-3 px-4 text-sm text-green-300 bg-[#0a0014] text-center font-medium">{item.vip}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'points' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-yellow-400/30 p-6 text-center" style={{background: 'linear-gradient(135deg, rgba(251,191,36,0.05), rgba(162,28,175,0.05))'}}>
              {user ? (
                <>
                  <div className="text-gray-400 text-sm mb-1">{t('myPoints')}</div>
                  <div className="text-5xl font-bold text-yellow-400 mb-4">{points}</div>
                  <button onClick={handleCheckin} disabled={checkedIn || checkinLoading}
                    className={`px-6 py-3 rounded-xl font-bold transition ${checkedIn ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90'}`}>
                    {checkinLoading ? t('processing') : checkedIn ? `✅ ${t('todayCheckedIn')}` : `📅 ${t('dailyCheckin')}`}
                  </button>
                </>
              ) : (
                <div>
                  <div className="text-4xl mb-3">🔐</div>
                  <p className="text-gray-300 mb-4">{t('loginToEarnPoints')}</p>
                  <button onClick={() => setShowLogin(true)} className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-bold hover:opacity-90 transition">
                    {t('loginOrRegister')}
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {Array.isArray(redeemItems) && redeemItems.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/50 transition">
                  <span className="text-3xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-white text-sm">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                  <button onClick={() => handleRedeem(item.cost, item.name, redeemKeys[i])}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${user ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'}`}>
                    {item.cost}{t('pointsUnit')}
                  </button>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/10 p-4 bg-white/5">
              <h3 className="font-bold text-white mb-3">📋 {t('earnTitle')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                {Array.isArray(earnMethods) && earnMethods.map((a, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/5">
                    <div className="text-xs text-gray-400">{a.action}</div>
                    <div className="text-sm font-bold text-yellow-400">{a.points}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {testimonials.map((item, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-xl">{item.avatar}</div>
                  <div>
                    <div className="font-bold text-white text-sm">{item.name}</div>
                    <div className="text-yellow-400 text-xs">{'⭐'.repeat(item.rating)}</div>
                  </div>
                  <div className="ml-auto text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{t('verifiedVip')}</div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
