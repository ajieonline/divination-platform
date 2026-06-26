'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { BookOpen, Sparkles, Star, Calendar, Gift, RefreshCw, Info } from 'lucide-react'

const dailyFortunes = [
  { rank: '大吉', color: 'text-green-400', bg: 'from-green-500/20 to-green-600/20', icon: '🌟', poem: '春风得意马蹄疾，一日看尽长安花', meaning: '万事如意，心想事成' },
  { rank: '中吉', color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/20', icon: '✨', poem: '山重水复疑无路，柳暗花明又一村', meaning: '困境终将过去，好运将至' },
  { rank: '小吉', color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-600/20', icon: '⭐', poem: '随风潜入夜，润物细无声', meaning: '循序渐进，稳步发展' },
  { rank: '平', color: 'text-mystical-300', bg: 'from-mystical-500/20 to-mystical-600/20', icon: '🌙', poem: '行到水穷处，坐看云起时', meaning: '顺其自然，静待时机' },
  { rank: '末吉', color: 'text-orange-400', bg: 'from-orange-500/20 to-orange-600/20', icon: '💫', poem: '不经一番寒彻骨，怎得梅花扑鼻香', meaning: '经历磨练，方能成功' },
]

const luckyAdvice: Record<string, string[]> = {
  '大吉': ['今天适合开展新项目', '贵人运旺，多与人交流', '财运亨通，可适度投资', '感情甜蜜，适合表白'],
  '中吉': ['工作中可能有意外收获', '学习效率高，适合充电', '社交运不错，多参加聚会', '健康方面注意休息'],
  '小吉': ['保持耐心，好事多磨', '关注细节，避免疏忽', '与朋友互动增进感情', '适当运动保持精力'],
  '平': ['按部就班，不宜冒险', '多听少说，观察形势', '整理内务，清理思绪', '享受当下，知足常乐'],
  '末吉': ['困难是暂时的，坚持就是胜利', '反思过去，总结经验', '调整心态，积极面对', '寻求帮助，不要独自承担'],
}

const streakMilestones = [7, 14, 30, 60, 100, 365]

export default function SignInPage() {
  const [hasSignedToday, setHasSignedToday] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showFortune, setShowFortune] = useState(false)
  const [currentFortune, setCurrentFortune] = useState<typeof dailyFortunes[0] | null>(null)
  const [todayAdvice, setTodayAdvice] = useState<string[]>([])
  const [streak, setStreak] = useState(3) // Simulated streak
  const [totalSigns, setTotalSigns] = useState(42) // Simulated total
  const [showHistory, setShowHistory] = useState(false)

  const handleSignIn = () => {
    if (hasSignedToday) return
    setIsDrawing(true)
    setTimeout(() => {
      const fortuneIdx = Math.floor(Math.random() * dailyFortunes.length)
      const fortune = dailyFortunes[fortuneIdx]
      const adviceList = luckyAdvice[fortune.rank]
      const selectedAdvice = adviceList.sort(() => Math.random() - 0.5).slice(0, 3)

      setCurrentFortune(fortune)
      setTodayAdvice(selectedAdvice)
      setIsDrawing(false)
      setShowFortune(true)
      setHasSignedToday(true)
      setStreak(prev => prev + 1)
      setTotalSigns(prev => prev + 1)
    }, 2000)
  }

  const nextMilestone = streakMilestones.find(m => m > streak) || streakMilestones[streakMilestones.length - 1]

  const recentFortunes = [
    { date: '昨天', rank: '中吉', icon: '✨' },
    { date: '前天', rank: '大吉', icon: '🌟' },
    { date: '3天前', rank: '小吉', icon: '⭐' },
    { date: '4天前', rank: '平', icon: '🌙' },
    { date: '5天前', rank: '中吉', icon: '✨' },
  ]

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-gradient-gold">每日签到</span>
          </h1>
          <p className="text-mystical-300">每日抽签，获取专属运势指引</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Fortune Area */}
          <div className="lg:col-span-2">
            {!showFortune ? (
              <Card className="text-center" padding="lg">
                {/* Streak Info */}
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold">{streak}</div>
                    <div className="text-xs text-mystical-400 mt-1">连续签到</div>
                  </div>
                  <div className="w-px h-10 bg-mystical-600/30" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{totalSigns}</div>
                    <div className="text-xs text-mystical-400 mt-1">累计签到</div>
                  </div>
                </div>

                {/* Fortune Stick */}
                <div className="relative w-32 h-64 mx-auto mb-8">
                  <AnimatePresence mode="wait">
                    {isDrawing ? (
                      <motion.div
                        key="drawing"
                        initial={{ rotateZ: 0 }}
                        animate={{ rotateZ: [-15, 15, -15, 15, 0] }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        className="absolute inset-0 flex flex-col items-center"
                      >
                        <div className="w-16 h-56 bg-gradient-to-b from-amber-600 via-amber-500 to-amber-700 rounded-t-full rounded-b-lg border-2 border-amber-400/50 flex flex-col items-center justify-center shadow-lg shadow-amber-500/20">
                          <div className="text-amber-900 text-xs font-bold rotate-90 whitespace-nowrap">求签中</div>
                        </div>
                        <div className="w-2 h-4 bg-amber-800 -mt-1" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center"
                      >
                        <div className="w-16 h-56 bg-gradient-to-b from-amber-700 via-amber-600 to-amber-800 rounded-t-full rounded-b-lg border-2 border-amber-500/30 flex flex-col items-center justify-center shadow-lg">
                          <BookOpen size={24} className="text-amber-200 mb-2" />
                          <div className="text-amber-200 text-xs font-bold rotate-90 whitespace-nowrap">灵境签筒</div>
                        </div>
                        <div className="w-2 h-4 bg-amber-800 -mt-1" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {hasSignedToday ? (
                  <div className="space-y-3">
                    <p className="text-mystical-300">✅ 今日已签到</p>
                    <Button variant="ghost" onClick={() => setShowHistory(true)}>
                      查看今日签文
                    </Button>
                  </div>
                ) : (
                  <Button variant="gold" size="lg" onClick={handleSignIn} loading={isDrawing} disabled={isDrawing}>
                    {isDrawing ? '抽签中...' : '每日一签'}
                  </Button>
                )}
              </Card>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card padding="lg">
                    <div className="text-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="text-5xl mb-3"
                      >
                        {currentFortune?.icon}
                      </motion.div>
                      <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className={`text-3xl font-bold mb-2 ${currentFortune?.color}`}
                      >
                        {currentFortune?.rank}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-mystical-300 text-lg italic"
                      >
                        「{currentFortune?.poem}」
                      </motion.p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-gold-500/5 border border-gold-500/20 rounded-xl p-4 mb-6"
                    >
                      <h3 className="text-gold font-bold mb-2">签意解读</h3>
                      <p className="text-mystical-200">{currentFortune?.meaning}</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Sparkles size={18} className="text-gold" />
                        今日建议
                      </h3>
                      <div className="space-y-2">
                        {todayAdvice.map((advice, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2 + i * 0.15 }}
                            className="flex items-center gap-3 p-3 bg-mystical-900/50 rounded-xl border border-mystical-600/20"
                          >
                            <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0">
                              <span className="text-xs text-gold font-bold">{i + 1}</span>
                            </div>
                            <span className="text-sm text-mystical-200">{advice}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <div className="mt-6 text-center">
                      <Button variant="ghost" onClick={() => { setShowFortune(false); setCurrentFortune(null) }}>
                        返回签筒
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Streak Progress */}
            <Card padding="lg">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Star size={16} className="text-gold" />
                连续签到进度
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-mystical-300">当前连续 {streak} 天</span>
                  <span className="text-gold">目标 {nextMilestone} 天</span>
                </div>
                <div className="w-full h-3 bg-mystical-900/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(streak / nextMilestone) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                  />
                </div>
                <div className="flex justify-between">
                  {streakMilestones.slice(0, 4).map(m => (
                    <div key={m} className={`text-center ${streak >= m ? 'text-gold' : 'text-mystical-500'}`}>
                      <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${streak >= m ? 'bg-gold-500' : 'bg-mystical-700'}`} />
                      <span className="text-[10px]">{m}天</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Rewards */}
            <Card padding="lg">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Gift size={16} className="text-gold" />
                签到奖励
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-mystical-900/50 rounded-lg border border-mystical-600/20">
                  <div className="text-lg">🎫</div>
                  <div className="flex-1">
                    <div className="text-xs text-white">免费占卜次数</div>
                    <div className="text-[10px] text-mystical-400">连续签到7天获得</div>
                  </div>
                  <div className={`text-xs font-bold ${streak >= 7 ? 'text-green-400' : 'text-mystical-500'}`}>
                    {streak >= 7 ? '已获得' : `${Math.min(streak, 7)}/7`}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-mystical-900/50 rounded-lg border border-mystical-600/20">
                  <div className="text-lg">👑</div>
                  <div className="flex-1">
                    <div className="text-xs text-white">VIP会员体验</div>
                    <div className="text-[10px] text-mystical-400">连续签到30天获得</div>
                  </div>
                  <div className={`text-xs font-bold ${streak >= 30 ? 'text-green-400' : 'text-mystical-500'}`}>
                    {streak >= 30 ? '已获得' : `${Math.min(streak, 30)}/30`}
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent History */}
            <Card padding="lg">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-gold" />
                近期签到
              </h3>
              <div className="space-y-2">
                {recentFortunes.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-mystical-900/50 rounded-lg border border-mystical-600/20">
                    <span className="text-xs text-mystical-400">{f.date}</span>
                    <span className="text-sm">{f.icon}</span>
                    <span className="text-xs text-mystical-300">{f.rank}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Info */}
        <div className="mt-12 mb-8">
          <Card className="max-w-3xl mx-auto" padding="lg">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white mb-2">签到规则</h4>
                <ul className="space-y-2 text-sm text-mystical-300">
                  <li>• 每天可以签到一次，签到后获得当日运势签文</li>
                  <li>• <span className="text-gold">连续签到</span>可获得额外奖励和特殊成就</li>
                  <li>• <span className="text-gold">签文等级</span>：大吉 &gt; 中吉 &gt; 小吉 &gt; 平 &gt; 末吉</li>
                  <li>• 签文仅供娱乐参考，请理性看待</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
