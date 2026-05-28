import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
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
import LanguageSwitcher from './components/LanguageSwitcher'

export const AuthContext = React.createContext()

function NavBar() {
  const { t } = useTranslation()
  const { user } = React.useContext(AuthContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{background: 'rgba(15, 5, 36, 0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(217, 70, 239, 0.15)'}}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🔮</span>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-300 to-yellow-300 bg-clip-text text-transparent hidden sm:block">{t('nav.siteName')}</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all"
              style={{
                background: location.pathname === l.to ? 'rgba(162,28,175,0.3)' : 'transparent',
                color: location.pathname === l.to ? '#e9d5ff' : 'rgba(196,181,253,0.7)'
              }}>
              <span>{l.icon}</span><span>{l.label}</span>
            </Link>
          ))}

          <div className="relative">
            <button onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all"
              style={{
                background: moreLinks.some(l => location.pathname === l.to) ? 'rgba(162,28,175,0.3)' : 'transparent',
                color: moreLinks.some(l => location.pathname === l.to) ? '#e9d5ff' : 'rgba(196,181,253,0.7)'
              }}>
              {t('nav.more')} <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                <div className="absolute top-full right-0 mt-2 py-2 rounded-xl z-50 w-40"
                  style={{background: 'rgba(15,8,40,0.98)', border: '1px solid rgba(217,70,239,0.3)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>
                  {moreLinks.map(l => (
                    <Link key={l.to} to={l.to} onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-purple-200/80 hover:text-white hover:bg-purple-900/30 transition-all">
                      <span>{l.icon}</span><span>{l.label}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          <Link to="/vip" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-yellow-300/80 hover:text-yellow-300 transition-all">
            👑 {t('nav.vip')}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-purple-200/80 hover:text-white transition-all">
              <span>👤</span>
              <span className="hidden sm:block">{user.nickname || user.username}</span>
              {user.isVip && <span className="text-yellow-300">👑</span>}
            </Link>
          ) : (
            <Link to="/profile" className="btn-mystic text-sm py-1.5 px-3 inline-block">{t('nav.login')}</Link>
          )}

          <LanguageSwitcher />
          <button className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`w-5 h-0.5 bg-purple-300 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-purple-300 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-purple-300 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden"
            style={{background: 'rgba(15,5,36,0.98)', borderTop: '1px solid rgba(217,70,239,0.15)'}}>
            <div className="p-4 space-y-1">
              {[...links, ...moreLinks].map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all"
                  style={{
                    background: location.pathname === l.to ? 'rgba(162,28,175,0.3)' : 'transparent',
                    color: location.pathname === l.to ? '#e9d5ff' : 'rgba(196,181,253,0.7)'
                  }}>
                  <span className="text-lg">{l.icon}</span><span>{l.label}</span>
                </Link>
              ))}
              <Link to="/vip" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-yellow-300/80">
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
        <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #0f0524 0%, #1a0a3e 50%, #0d0318 100%)'}}>
          <Routes>
            <Route path="/admin" element={<Admin />} />
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
                    <Route path="/vip" element={<VipCenter />} />
                    <Route path="/profile" element={<Profile />} />
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
