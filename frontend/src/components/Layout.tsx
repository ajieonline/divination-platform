'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import {
  Home, Sparkles, Star, Hexagon, Calendar, Heart,
  Moon, PenTool, BookOpen, User, Share2, Compass
} from 'lucide-react'
import ParticleBackground from './ParticleBackground'

const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/tarot', label: '塔罗占卜', icon: Sparkles },
  { href: '/zodiac', label: '星座运势', icon: Star },
  { href: '/iching', label: '周易占卜', icon: Hexagon },
  { href: '/bazi', label: '八字命理', icon: Calendar },
  { href: '/match', label: '星座配对', icon: Heart },
  { href: '/dream', label: '解梦', icon: Moon },
  { href: '/name', label: '姓名测试', icon: PenTool },
  { href: '/daily', label: '每日签到', icon: BookOpen },
  { href: '/user', label: '个人中心', icon: User },
]

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-mystical-900 relative">
      <ParticleBackground />

      {/* PC Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-mystical-800/90 backdrop-blur-xl border-r border-mystical-600/20 flex-col z-40">
        <div className="p-6 border-b border-mystical-600/20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
              <Compass size={24} className="text-mystical-900" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient-gold">灵境占卜</h1>
              <p className="text-xs text-mystical-400">探索命运的奥秘</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative',
                    isActive
                      ? 'bg-gold-500/10 text-gold'
                      : 'text-mystical-300 hover:text-white hover:bg-mystical-700/50'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold-500 rounded-r-full"
                    />
                  )}
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-mystical-600/20">
          <div className="bg-mystical-900/50 rounded-xl p-4 border border-mystical-600/20">
            <div className="flex items-center gap-2 mb-2">
              <Share2 size={16} className="text-gold" />
              <span className="text-sm font-medium text-mystical-200">分享给好友</span>
            </div>
            <p className="text-xs text-mystical-400">邀请好友一起探索命运</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen relative z-10 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-mystical-800/95 backdrop-blur-xl border-t border-mystical-600/20 z-40 bottom-nav">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={clsx(
                    'flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all duration-200',
                    isActive ? 'text-gold' : 'text-mystical-400'
                  )}
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active"
                      className="w-4 h-0.5 bg-gold-500 rounded-full"
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
          <Link href="/user" className="flex-1">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={clsx(
                'flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all duration-200',
                pathname === '/user' ? 'text-gold' : 'text-mystical-400'
              )}
            >
              <User size={20} />
              <span className="text-[10px] font-medium">我的</span>
            </motion.div>
          </Link>
        </div>
      </nav>
    </div>
  )
}
