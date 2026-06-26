'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import {
  Sparkles, Star, Hexagon, Calendar, Heart, Moon,
  PenTool, BookOpen, Compass, ChevronRight, Flame, Zap
} from 'lucide-react'

const features = [
  {
    title: '塔罗占卜',
    description: '揭示命运的神秘面纱，探索未来无限可能',
    href: '/tarot',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: '星座运势',
    description: '每日星座运势，掌握生活方方面面',
    href: '/zodiac',
    icon: Star,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: '周易占卜',
    description: '古老智慧，指引人生方向',
    href: '/iching',
    icon: Hexagon,
    color: 'from-red-500 to-orange-500',
  },
  {
    title: '八字命理',
    description: '解读生辰八字，洞察命理玄机',
    href: '/bazi',
    icon: Calendar,
    color: 'from-yellow-500 to-amber-500',
  },
  {
    title: '星座配对',
    description: '探索星座之间的化学反应与默契',
    href: '/match',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
  },
  {
    title: '解梦',
    description: '解读梦境密码，发现潜意识的声音',
    href: '/dream',
    icon: Moon,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    title: '姓名测试',
    description: '姓名蕴含的五行能量与运势',
    href: '/name',
    icon: PenTool,
    color: 'from-teal-500 to-green-500',
  },
  {
    title: '每日签到',
    description: '每日抽签，获取专属运势指引',
    href: '/daily',
    icon: BookOpen,
    color: 'from-orange-500 to-yellow-500',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function HomePage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32">
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-mystical-500/10 rounded-full blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6"
            >
              <Compass size={16} className="text-gold animate-spin-slow" />
              <span className="text-sm text-gold">探索命运的奥秘</span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-gradient-gold">灵境</span>
              <span className="text-white">占卜</span>
            </h1>

            <p className="text-lg sm:text-xl text-mystical-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              集塔罗、星座、周易、八字于一体的神秘学平台<br className="hidden sm:block" />
              用古老的智慧，为你照亮前行的道路
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/tarot">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-mystical-900 font-bold rounded-xl glow-gold-strong flex items-center gap-2"
                >
                  <Sparkles size={20} />
                  开始占卜
                </motion.button>
              </Link>
              <Link href="/zodiac">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-mystical-800/50 border border-mystical-500/30 text-mystical-200 font-medium rounded-xl hover:bg-mystical-700/50 flex items-center gap-2"
                >
                  <Star size={20} />
                  查看运势
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Daily Fortune Banner */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-mystical-800 via-mystical-700 to-mystical-800 border border-gold-500/20 p-6 sm:p-8"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-mystical-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gold-500/20 flex items-center justify-center shrink-0">
                <Flame size={28} className="text-gold" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gold mb-1">今日运势速递</h3>
                <p className="text-mystical-300 text-sm sm:text-base">
                  今日水星与木星形成三分相位，思维敏捷，适合学习新知识。感情方面可能有意外惊喜！
                </p>
              </div>
              <Link href="/daily">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-gold-500/20 border border-gold-500/30 text-gold rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-1"
                >
                  抽取签运 <ChevronRight size={16} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Zap size={24} className="text-gold" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">占卜工具</h2>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.div key={feature.href} variants={item}>
                  <Link href={feature.href}>
                    <Card className="group h-full" hover>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-mystical-400 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        立即体验 <ChevronRight size={16} />
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="text-center pb-8 text-mystical-500 text-sm">
          <p>© 2024 灵境占卜 · 探索命运的奥秘</p>
        </footer>
      </div>
    </Layout>
  )
}
