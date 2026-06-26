import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthContext } from '../App'
import { useTranslation } from 'react-i18next'

const featuresData = [
  { to: '/tarot', icon: '🃏', key: 'tarot', color: 'from-purple-600 to-indigo-800' },
  { to: '/zodiac', icon: '⭐', key: 'zodiac', color: 'from-blue-600 to-purple-800' },
  { to: '/eight-char', icon: '☯️', key: 'bazi', color: 'from-red-600 to-orange-800' },
  { to: '/iching', icon: '📖', key: 'iching', color: 'from-yellow-600 to-red-800' },
  { to: '/name', icon: '✍️', key: 'name', color: 'from-pink-600 to-purple-800' },
  { to: '/sign', icon: '🎋', key: 'sign', color: 'from-green-600 to-teal-800' },
  { to: '/dream', icon: '💤', key: 'dream', color: 'from-indigo-600 to-blue-800' },
  { to: '/daily', icon: '📅', key: 'daily', color: 'from-amber-600 to-orange-800' }
]

const starPoints = Array.from({ length: 44 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 100}%`,
  animationDelay: `${(i % 9) * 0.35}s`,
  animationDuration: `${2.4 + (i % 5) * 0.45}s`
}))

function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {starPoints.map((star, i) => (
        <div key={i} className="star" style={star} />
      ))}
    </div>
  )
}

export default function Home() {
  const { t } = useTranslation('home')

  const features = featuresData.map(f => ({
    ...f,
    title: t('features.' + f.key + '.title'),
    desc: t('features.' + f.key + '.desc')
  }))

  const { user } = React.useContext(AuthContext)
  const heroStats = t('hero.stats', { returnObjects: true })
  const trustItems = t('trust.items', { returnObjects: true })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen relative">
      <StarField />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-12 md:py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-center">
          <motion.div initial={{ y: 26, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-300/25 bg-amber-300/10 text-amber-100 text-sm mb-5">
              <span>✦</span>{t('hero.kicker')}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-amber-100 via-rose-200 to-cyan-100 bg-clip-text text-transparent">
                {t('hero.title')}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200/72 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {t('hero.subtitle')}
              <br className="hidden sm:block" />{t('hero.subtitle2')}
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link to="/tarot" className="btn-mystic text-base md:text-lg">{t('hero.startBtn')}</Link>
              <Link to="/daily" className="btn-gold text-base md:text-lg">{t('hero.dailyBtn')}</Link>
            </div>
            {Array.isArray(heroStats) && (
              <div className="grid grid-cols-3 gap-3 mt-8 max-w-xl mx-auto lg:mx-0">
                {heroStats.map((item) => (
                  <div key={item.label} className="stat-pill">
                    <div className="text-xl md:text-2xl font-bold text-amber-200">{item.value}</div>
                    <div className="text-xs text-slate-300/70">{item.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.1 }} className="relative">
            <img src="/assets/divination-hero.png" alt="" className="hero-visual" />
          </motion.div>
        </div>
      </section>

      {/* Registration Prompt */}
      {!user && (
        <section className="max-w-5xl mx-auto px-4 mb-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
            className="rounded-lg p-5 md:p-6 overflow-hidden"
            style={{background: 'linear-gradient(135deg, rgba(251,191,36,0.14), rgba(45,212,191,0.08), rgba(236,72,153,0.10))', border: '1px solid rgba(251,191,36,0.22)'}}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left min-w-0">
                <h3 className="text-lg font-bold text-yellow-300">{t('register.title')}</h3>
                <p className="text-sm text-purple-200/60">{t('register.desc')}</p>
              </div>
              <Link to="/profile" className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-yellow-300 to-rose-400 text-black font-bold text-sm hover:opacity-90 transition whitespace-nowrap shrink-0">
                {t('register.btn')}
              </Link>
            </div>
          </motion.div>
        </section>
      )}

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="section-heading">
          <h2 className="section-title">{t('features.title')}</h2>
          <p className="section-subtitle">{t('features.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.to} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}>
              <Link to={f.to} className="block card-glass feature-card p-6 transition-all duration-300 group h-full">
                <div className={`icon-badge bg-gradient-to-br ${f.color} group-hover:scale-105 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-purple-100 mb-2">{f.title}</h3>
                <p className="text-sm text-purple-300/60">{f.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VIP Pricing Banner */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="section-heading">
            <span className="text-yellow-400 text-3xl">👑</span>
            <h2 className="section-title mt-2">{t('vip.title')}</h2>
            <p className="section-subtitle">{t('vip.desc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="pricing-card">
              <div className="text-sm text-gray-400 mb-1">{t('vip.monthly')}</div>
              <div className="text-4xl font-bold text-yellow-400 mb-1">¥29.9</div>
              <div className="text-xs text-gray-400 mb-4">{t('vip.perDay')} ¥1.00</div>
              <Link to="/vip" className="inline-block w-full py-3 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-bold transition">{t('vip.activate')}</Link>
            </div>
            <div className="pricing-card pricing-card-featured">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full">{t('vip.bestValue')}</div>
              <div className="text-sm text-gray-400 mb-1">{t('vip.yearly')}</div>
              <div className="text-4xl font-bold text-yellow-400 mb-1">¥199</div>
              <div className="text-xs text-gray-400 mb-4">{t('vip.perDay')} ¥0.55</div>
              <Link to="/vip" className="inline-block w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-bold transition">{t('vip.activateNow')}</Link>
            </div>
            <div className="pricing-card">
              <div className="text-sm text-gray-400 mb-1">{t('vip.quarterly')}</div>
              <div className="text-4xl font-bold text-yellow-400 mb-1">¥69.9</div>
              <div className="text-xs text-gray-400 mb-4">{t('vip.perDay')} ¥0.78</div>
              <Link to="/vip" className="inline-block w-full py-3 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-bold transition">{t('vip.activate')}</Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Daily Fortune Banner */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <motion.div whileHover={{ scale: 1.01 }} className="card-glass p-8 text-center" style={{background: 'linear-gradient(135deg, rgba(20,184,166,0.14), rgba(251,191,36,0.10), rgba(162,28,175,0.12))'}}>
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-2xl font-bold text-yellow-300 mb-2">{t('daily.title')}</h2>
          <p className="text-purple-200/70 mb-6">{t('daily.desc')}</p>
          <Link to="/daily" className="btn-gold">{t('daily.btn')}</Link>
        </motion.div>
      </section>

      {Array.isArray(trustItems) && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-3 gap-4">
            {trustItems.map((item, i) => (
              <div key={item.title} className="trust-item">
                <div className="text-2xl">{['🧭', '🔐', '✨'][i] || '✦'}</div>
                <div>
                  <h3 className="font-bold text-slate-100">{item.title}</h3>
                  <p className="text-sm text-slate-300/68 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  )
}
