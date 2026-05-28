import React, { useContext } from 'react'
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

function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className="star" style={{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 3 + 's',
          animationDuration: (Math.random() * 3 + 2) + 's'
        }} />
      ))}
    </div>
  )
}

export default function Home() {
  const { t } = useTranslation('home')
  const tc = useTranslation('common')

  const features = featuresData.map(f => ({
    ...f,
    title: t('features.' + f.key + '.title'),
    desc: t('features.' + f.key + '.desc')
  }))

  const { user } = React.useContext(AuthContext)
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen relative">
      <StarField />

      {/* Hero */}
      <section className="relative py-20 px-4 text-center">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <div className="text-8xl mb-6 animate-float">🔮</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </h1>
          <p className="text-xl text-purple-200/70 max-w-2xl mx-auto mb-8">
            {t('hero.subtitle')}
            <br />{t('hero.subtitle2')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/tarot" className="btn-mystic text-lg">{t('hero.startBtn')}</Link>
            <Link to="/daily" className="btn-gold text-lg">{t('hero.dailyBtn')}</Link>
          </div>
        </motion.div>
      </section>

      {/* Registration Prompt */}
      {!user && (
        <section className="max-w-4xl mx-auto px-4 -mt-4 mb-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
            className="rounded-2xl p-6 text-center"
            style={{background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(236,72,153,0.1))', border: '1px solid rgba(251,191,36,0.2)'}}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="text-left">
                <h3 className="text-lg font-bold text-yellow-300">{t('register.title')}</h3>
                <p className="text-sm text-purple-200/60">{t('register.desc')}</p>
              </div>
              <Link to="/profile" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-bold text-sm hover:opacity-90 transition whitespace-nowrap">
                {t('register.btn')}
              </Link>
            </div>
          </motion.div>
        </section>
      )}

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-300 to-yellow-300 bg-clip-text text-transparent">
          {t('features.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.to} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}>
              <Link to={f.to} className="block card-glass p-6 hover:scale-105 transition-all duration-300 group h-full">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
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
      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="text-center mb-8">
            <span className="text-yellow-400 text-3xl">👑</span>
            <h2 className="text-3xl font-bold text-white mt-2">{t('vip.title')}</h2>
            <p className="text-purple-300/70 mt-2">{t('vip.desc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-purple-500/50 transition">
              <div className="text-sm text-gray-400 mb-1">{t('vip.monthly')}</div>
              <div className="text-4xl font-bold text-yellow-400 mb-1">¥29.9</div>
              <div className="text-xs text-gray-400 mb-4">{t('vip.perDay')} ¥1.00</div>
              <Link to="/vip" className="inline-block w-full py-3 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-bold transition">{t('vip.activate')}</Link>
            </div>
            <div className="bg-white/5 border-2 border-yellow-400/50 rounded-2xl p-6 text-center relative hover:border-yellow-400 transition">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full">{t('vip.bestValue')}</div>
              <div className="text-sm text-gray-400 mb-1">{t('vip.yearly')}</div>
              <div className="text-4xl font-bold text-yellow-400 mb-1">¥199</div>
              <div className="text-xs text-gray-400 mb-4">{t('vip.perDay')} ¥0.55</div>
              <Link to="/vip" className="inline-block w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-bold transition">{t('vip.activateNow')}</Link>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-purple-500/50 transition">
              <div className="text-sm text-gray-400 mb-1">{t('vip.quarterly')}</div>
              <div className="text-4xl font-bold text-yellow-400 mb-1">¥69.9</div>
              <div className="text-xs text-gray-400 mb-4">{t('vip.perDay')} ¥0.78</div>
              <Link to="/vip" className="inline-block w-full py-3 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-bold transition">{t('vip.activate')}</Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Daily Fortune Banner */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <motion.div whileHover={{ scale: 1.02 }} className="card-glass p-8 text-center" style={{background: 'linear-gradient(135deg, rgba(162,28,175,0.2), rgba(251,191,36,0.1))'}}>
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-2xl font-bold text-yellow-300 mb-2">{t('daily.title')}</h2>
          <p className="text-purple-200/70 mb-6">{t('daily.desc')}</p>
          <Link to="/daily" className="btn-gold">{t('daily.btn')}</Link>
        </motion.div>
      </section>
    </motion.div>
  )
}
