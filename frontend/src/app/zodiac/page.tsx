'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import { Star, Heart, Briefcase, Wallet, Activity, Calendar } from 'lucide-react'

const zodiacSigns = [
  { name: '白羊座', symbol: '♈', dates: '3.21-4.19', element: '火', icon: '🐏' },
  { name: '金牛座', symbol: '♉', dates: '4.20-5.20', element: '土', icon: '🐂' },
  { name: '双子座', symbol: '♊', dates: '5.21-6.21', element: '风', icon: '👯' },
  { name: '巨蟹座', symbol: '♋', dates: '6.22-7.22', element: '水', icon: '🦀' },
  { name: '狮子座', symbol: '♌', dates: '7.23-8.22', element: '火', icon: '🦁' },
  { name: '处女座', symbol: '♍', dates: '8.23-9.22', element: '土', icon: '👧' },
  { name: '天秤座', symbol: '♎', dates: '9.23-10.23', element: '风', icon: '⚖️' },
  { name: '天蝎座', symbol: '♏', dates: '10.24-11.22', element: '水', icon: '🦂' },
  { name: '射手座', symbol: '♐', dates: '11.23-12.21', element: '火', icon: '🏹' },
  { name: '摩羯座', symbol: '♑', dates: '12.22-1.19', element: '土', icon: '🐐' },
  { name: '水瓶座', symbol: '♒', dates: '1.20-2.18', element: '风', icon: '🏺' },
  { name: '双鱼座', symbol: '♓', dates: '2.19-3.20', element: '水', icon: '🐟' },
]

const timeTabs = [
  { key: 'daily', label: '今日' },
  { key: 'weekly', label: '本周' },
  { key: 'monthly', label: '本月' },
]

const fortuneCategories = [
  { key: 'love', label: '爱情', icon: Heart, color: 'text-pink-400' },
  { key: 'career', label: '事业', icon: Briefcase, color: 'text-blue-400' },
  { key: 'wealth', label: '财运', icon: Wallet, color: 'text-yellow-400' },
  { key: 'health', label: '健康', icon: Activity, color: 'text-green-400' },
]

const generateFortune = (zodiac: string, period: string) => {
  const seed = zodiac.length + period.length
  const fortunes = {
    love: [
      { score: 85, text: '今天桃花运旺盛，单身者有机会遇到心仪的对象。已有伴者可以安排一次浪漫的约会。', lucky_color: '粉色', lucky_number: 7 },
      { score: 70, text: '感情平稳发展，适合与伴侣进行深入沟通。单身者可以多参加社交活动。', lucky_color: '紫色', lucky_number: 3 },
      { score: 60, text: '感情方面需要耐心，不要急于求成。给彼此一些空间和时间。', lucky_color: '白色', lucky_number: 9 },
    ],
    career: [
      { score: 90, text: '工作运势极佳，创意灵感不断，适合推进重要项目。领导可能会给予肯定。', lucky_color: '金色', lucky_number: 8 },
      { score: 75, text: '工作节奏平稳，适合处理日常事务。可以利用这段时间学习新技能。', lucky_color: '蓝色', lucky_number: 2 },
      { score: 65, text: '职场上可能遇到一些小阻碍，保持冷静，与同事多沟通协作。', lucky_color: '灰色', lucky_number: 5 },
    ],
    wealth: [
      { score: 80, text: '财运不错，可能会有意外收入。投资理财方面可以适度尝试。', lucky_color: '金色', lucky_number: 6 },
      { score: 70, text: '收支平衡，适合进行财务规划。避免冲动消费。', lucky_color: '绿色', lucky_number: 4 },
      { score: 55, text: '财运一般，不宜进行大额投资。量入为出，稳健理财。', lucky_color: '棕色', lucky_number: 1 },
    ],
    health: [
      { score: 85, text: '身体状态良好，精力充沛。适合进行户外运动和健身。', lucky_color: '绿色', lucky_number: 3 },
      { score: 70, text: '注意劳逸结合，避免过度疲劳。保证充足的睡眠。', lucky_color: '蓝色', lucky_number: 7 },
      { score: 60, text: '身体可能有些疲倦，适当休息。注意饮食规律。', lucky_color: '白色', lucky_number: 5 },
    ],
  }

  const result: Record<string, any> = {}
  Object.keys(fortunes).forEach(key => {
    const idx = (seed + key.length) % 3
    result[key] = fortunes[key as keyof typeof fortunes][idx]
  })
  return result
}

export default function ZodiacPage() {
  const [selectedZodiac, setSelectedZodiac] = useState(0)
  const [activeTime, setActiveTime] = useState('daily')
  const [activeCategory, setActiveCategory] = useState('love')

  const zodiac = zodiacSigns[selectedZodiac]
  const fortune = generateFortune(zodiac.name, activeTime)
  const currentFortune = fortune[activeCategory]

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-gradient-gold">星座运势</span>
          </h1>
          <p className="text-mystical-300">选择你的星座，查看最新运势分析</p>
        </motion.div>

        {/* Zodiac Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 sm:gap-3 mb-8">
          {zodiacSigns.map((z, i) => (
            <motion.button
              key={z.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedZodiac(i)}
              className={`p-2 sm:p-3 rounded-xl border text-center transition-all duration-200 ${
                selectedZodiac === i
                  ? 'bg-gold-500/20 border-gold-500/50 text-gold'
                  : 'bg-mystical-800/50 border-mystical-600/20 text-mystical-300 hover:border-mystical-500/30'
              }`}
            >
              <div className="text-xl sm:text-2xl mb-1">{z.icon}</div>
              <div className="text-[10px] sm:text-xs font-medium truncate">{z.name}</div>
            </motion.button>
          ))}
        </div>

        {/* Selected Zodiac Info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedZodiac}-${activeTime}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="mb-6" padding="lg">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="text-center sm:text-left">
                  <div className="text-5xl mb-2">{zodiac.icon}</div>
                  <h2 className="text-2xl font-bold text-gold">{zodiac.name}</h2>
                  <p className="text-sm text-mystical-400">{zodiac.dates} · {zodiac.element}象星座</p>
                </div>
                <div className="flex-1 w-full">
                  <Tabs tabs={timeTabs} activeTab={activeTime} onChange={setActiveTime} />
                </div>
              </div>
            </Card>

            {/* Fortune Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {fortuneCategories.map((cat) => {
                const Icon = cat.icon
                const f = fortune[cat.key]
                return (
                  <Card
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={activeCategory === cat.key ? 'ring-1 ring-gold-500/50' : ''}
                    padding="sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={18} className={cat.color} />
                      <span className="text-sm font-medium text-white">{cat.label}</span>
                    </div>
                    <div className={`text-2xl font-bold ${scoreColor(f.score)}`}>
                      {f.score}分
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Detailed Fortune */}
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <Calendar size={20} className="text-gold" />
                <h3 className="text-lg font-bold text-white">
                  {zodiac.name} · {activeTime === 'daily' ? '今日' : activeTime === 'weekly' ? '本周' : '本月'}运势
                </h3>
              </div>

              {/* Score Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-mystical-300">综合运势</span>
                  <span className={`text-sm font-bold ${scoreColor(currentFortune.score)}`}>{currentFortune.score}分</span>
                </div>
                <div className="w-full h-2 bg-mystical-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentFortune.score}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      currentFortune.score >= 80 ? 'bg-green-500' : currentFortune.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>

              <p className="text-mystical-200 leading-relaxed mb-4">{currentFortune.text}</p>

              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-mystical-400">幸运色：</span>
                  <span className="text-gold font-medium">{currentFortune.lucky_color}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-mystical-400">幸运数字：</span>
                  <span className="text-gold font-medium">{currentFortune.lucky_number}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  )
}
