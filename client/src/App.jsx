import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Tarot from './pages/Tarot'
import Zodiac from './pages/Zodiac'
import EightChar from './pages/EightChar'
import IChing from './pages/IChing'
import NameTest from './pages/NameTest'
import SignDraw from './pages/SignDraw'
import DreamInterpretation from './pages/DreamInterpretation'
import DailyFortune from './pages/DailyFortune'
import VipCenter from './pages/VipCenter'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import { Articles, Campaigns, CareerWealth, Consultants, LoveReading, Orders, Reports, Support, ZodiacAnimal } from './pages/ProductExpansion'
import LanguageSwitcher from './components/LanguageSwitcher'

export const AuthContext = React.createContext()

function NavBar() {
  const { t } = useTranslation()
  const { user } = React.useContext(AuthContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()
  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  const links = [
    { to: '/', label: t('nav.home'), icon: '🔮' },
    { to: '/tarot', label: t('nav.tarot'), icon: '🃏' },
    { to: '/zodiac', label: t('nav.zodiac'), icon: '⭐' },
    { to: '/daily', label: t('nav.daily'), icon: '📅' },
  ]

  const moreLinks = [
    { to: '/eight-char', label: t('nav.bazi'), icon: '☯️' },
    { to: '/iching', label: t('nav.iching'), icon: '☰' },
    { to: '/name', label: t('nav.name'), icon: '📝' },
    { to: '/sign', label: t('nav.sign'), icon: '🙏' },
    { to: '/dream', label: t('nav.dream'), icon: '💭' },
  ]

  const productLinks = [
    { to: '/zodiac-animal', label: '生肖运势', icon: '卯' },
    { to: '/love', label: '情感占卜', icon: '恋' },
    { to: '/career', label: '事业财运', icon: '财' },
    { to: '/reports', label: '深度报告', icon: '报' },
    { to: '/consultants', label: '占卜师咨询', icon: '师' },
    { to: '/articles', label: '内容资讯', icon: '文' },
    { to: '/campaigns', label: '活动专区', icon: '券' },
    { to: '/orders', label: '订单中心', icon: '单' },
    { to: '/support', label: '客服反馈', icon: '客' },
  ]
  const allMoreLinks = [...moreLinks, ...productLinks]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-shell">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 min-w-0 shrink">
          <span className="text-xl">🔮</span>
          <span className="text-lg font-bold bg-gradient-to-r from-amber-200 via-rose-200 to-cyan-200 bg-clip-text text-transparent hidden sm:block truncate">{t('siteName')}</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`nav-link ${isActive(l.to) ? 'nav-link-active' : ''}`}>
              <span>{l.icon}</span><span>{l.label}</span>
            </Link>
          ))}

          <div className="relative">
            <button onClick={() => setMoreOpen(!moreOpen)}
              aria-expanded={moreOpen}
              className={`nav-link ${allMoreLinks.some(l => isActive(l.to)) ? 'nav-link-active' : ''}`}>
              {t('nav.more')} <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                <div className="absolute top-full right-0 mt-2 py-2 rounded-lg z-50 w-56 max-h-[70vh] overflow-y-auto menu-panel">
                  {allMoreLinks.map(l => (
                    <Link key={l.to} to={l.to} onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200/80 hover:text-white hover:bg-white/10 transition-all">
                      <span>{l.icon}</span><span>{l.label}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          <Link to="/vip" className={`nav-link nav-link-vip ${isActive('/vip') ? 'nav-link-active' : ''}`}>
            👑 {t('nav.vip')}
          </Link>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-200/80 hover:text-white transition-all max-w-36">
              <span>👤</span>
              <span className="hidden sm:block truncate">{user.nickname || user.username}</span>
              {user.isVip && <span className="text-yellow-300">👑</span>}
            </Link>
          ) : (
            <Link to="/profile" className="btn-mystic btn-compact text-sm inline-block">{t('nav.login')}</Link>
          )}

          <LanguageSwitcher />
          <button aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')} aria-expanded={menuOpen}
            className="lg:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`w-5 h-0.5 bg-purple-300 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-purple-300 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-purple-300 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="lg:hidden overflow-hidden menu-panel border-x-0 border-t"
            style={{borderTopColor: 'rgba(217,70,239,0.15)'}}>
            <div className="p-4 space-y-1">
              {[...links, ...allMoreLinks].map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all"
                  style={{
                    background: isActive(l.to) ? 'rgba(45,212,191,0.14)' : 'transparent',
                    color: isActive(l.to) ? '#f8fafc' : 'rgba(226,232,240,0.72)'
                  }}>
                  <span className="text-lg">{l.icon}</span><span>{l.label}</span>
                </Link>
              ))}
              <Link to="/vip" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-yellow-300/90">
                <span className="text-lg">👑</span><span>{t('nav.vip')}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json()).then(d => {
          if (d.username) {
            setUser(d)
            fetch('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
              .then(r2 => r2.json()).then(d2 => { if (d2.username) setUser(d2) })
              .catch(() => {})
          }
        })
        .catch(() => {})
    }
  }, [token])

  const login = (userData, tokenStr) => { setUser(userData); setToken(tokenStr); localStorage.setItem('token', tokenStr) }
  const logout = () => { setUser(null); setToken(''); localStorage.removeItem('token') }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <BrowserRouter>
        <div className="min-h-screen app-shell">
          <Routes>
            <Route path="/admin/*" element={<Admin />} />
            <Route path="*" element={
              <>
                <NavBar />
                <div className="pt-14">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tarot" element={<Tarot />} />
                    <Route path="/zodiac" element={<Zodiac />} />
                    <Route path="/eight-char" element={<EightChar />} />
                    <Route path="/iching" element={<IChing />} />
                    <Route path="/name" element={<NameTest />} />
                    <Route path="/sign" element={<SignDraw />} />
                    <Route path="/dream" element={<DreamInterpretation />} />
                    <Route path="/daily" element={<DailyFortune />} />
                    <Route path="/zodiac-animal" element={<ZodiacAnimal />} />
                    <Route path="/love" element={<LoveReading />} />
                    <Route path="/career" element={<CareerWealth />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/consultants" element={<Consultants />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/vip" element={<VipCenter />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Home />} />
                  </Routes>
                </div>
              </>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}
