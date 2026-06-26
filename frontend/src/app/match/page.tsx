'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Heart, Sparkles, Info, ArrowRight } from 'lucide-react'

const zodiacSigns = [
  { name: '白羊座', symbol: '♈', dates: '3.21-4.19', element: '火', icon: '🐏', color: 'text-red-400' },
  { name: '金牛座', symbol: '♉', dates: '4.20-5.20', element: '土', icon: '🐂', color: 'text-green-400' },
  { name: '双子座', symbol: '♊', dates: '5.21-6.21', element: '风', icon: '👯', color: 'text-yellow-400' },
  { name: '巨蟹座', symbol: '♋', dates: '6.22-7.22', element: '水', icon: '🦀', color: 'text-blue-400' },
  { name: '狮子座', symbol: '♌', dates: '7.23-8.22', element: '火', icon: '🦁', color: 'text-orange-400' },
  { name: '处女座', symbol: '♍', dates: '8.23-9.22', element: '土', icon: '👧', color: 'text-green-300' },
  { name: '天秤座', symbol: '♎', dates: '9.23-10.23', element: '风', icon: '⚖️', color: 'text-pink-400' },
  { name: '天蝎座', symbol: '♏', dates: '10.24-11.22', element: '水', icon: '🦂', color: 'text-purple-400' },
  { name: '射手座', symbol: '♐', dates: '11.23-12.21', element: '火', icon: '🏹', color: 'text-blue-300' },
  { name: '摩羯座', symbol: '♑', dates: '12.22-1.19', element: '土', icon: '🐐', color: 'text-gray-300' },
  { name: '水瓶座', symbol: '♒', dates: '1.20-2.18', element: '风', icon: '🏺', color: 'text-cyan-400' },
  { name: '双鱼座', symbol: '♓', dates: '2.19-3.20', element: '水', icon: '🐟', color: 'text-indigo-400' },
]

// Compatibility matrix (simplified - scores 1-5)
const compatibilityMatrix: Record<string, Record<string, number>> = {
  '白羊座': { '白羊座': 4, '金牛座': 2, '双子座': 5, '巨蟹座': 2, '狮子座': 5, '处女座': 2, '天秤座': 4, '天蝎座': 2, '射手座': 5, '摩羯座': 3, '水瓶座': 4, '双鱼座': 3 },
  '金牛座': { '白羊座': 2, '金牛座': 4, '双子座': 2, '巨蟹座': 5, '狮子座': 3, '处女座': 5, '天秤座': 3, '天蝎座': 4, '射手座': 2, '摩羯座': 5, '水瓶座': 2, '双鱼座': 4 },
  '双子座': { '白羊座': 5, '金牛座': 2, '双子座': 4, '巨蟹座': 2, '狮子座': 4, '处女座': 2, '天秤座': 5, '天蝎座': 2, '射手座': 4, '摩羯座': 2, '水瓶座': 5, '双鱼座': 2 },
  '巨蟹座': { '白羊座': 2, '金牛座': 5, '双子座': 2, '巨蟹座': 4, '狮子座': 3, '处女座': 4, '天秤座': 2, '天蝎座': 5, '射手座': 2, '摩羯座': 3, '水瓶座': 2, '双鱼座': 5 },
  '狮子座': { '白羊座': 5, '金牛座': 3, '双子座': 4, '巨蟹座': 3, '狮子座': 4, '处女座': 2, '天秤座': 4, '天蝎座': 3, '射手座': 5, '摩羯座': 3, '水瓶座': 4, '双鱼座': 3 },
  '处女座': { '白羊座': 2, '金牛座': 5, '双子座': 2, '巨蟹座': 4, '狮子座': 2, '处女座': 4, '天秤座': 3, '天蝎座': 4, '射手座': 2, '摩羯座': 5, '水瓶座': 2, '双鱼座': 3 },
  '天秤座': { '白羊座': 4, '金牛座': 3, '双子座': 5, '巨蟹座': 2, '狮子座': 4, '处女座': 3, '天秤座': 4, '天蝎座': 2, '射手座': 3, '摩羯座': 2, '水瓶座': 5, '双鱼座': 4 },
  '天蝎座': { '白羊座': 2, '金牛座': 4, '双子座': 2, '巨蟹座': 5, '狮子座': 3, '处女座': 4, '天秤座': 2, '天蝎座': 4, '射手座': 2, '摩羯座': 3, '水瓶座': 2, '双鱼座': 5 },
  '射手座': { '白羊座': 5, '金牛座': 2, '双子座': 4, '巨蟹座': 2, '狮子座': 5, '处女座': 2, '天秤座': 3, '天蝎座': 2, '射手座': 4, '摩羯座': 2, '水瓶座': 4, '双鱼座': 3 },
  '摩羯座': { '白羊座': 3, '金牛座': 5, '双子座': 2, '巨蟹座': 3, '狮子座': 3, '处女座': 5, '天秤座': 2, '天蝎座': 3, '射手座': 2, '摩羯座': 4, '水瓶座': 3, '双鱼座': 3 },
  '水瓶座': { '白羊座': 4, '金牛座': 2, '双子座': 5, '巨蟹座': 2, '狮子座': 4, '处女座': 2, '天秤座': 5, '天蝎座': 2, '射手座': 4, '摩羯座': 3, '水瓶座': 4, '双鱼座': 3 },
  '双鱼座': { '白羊座': 3, '金牛座': 4, '双子座': 2, '巨蟹座': 5, '狮子座': 3, '处女座': 3, '天秤座': 4, '天蝎座': 5, '射手座': 3, '摩羯座': 3, '水瓶座': 3, '双鱼座': 4 },
}

const compatibilityTexts: Record<number, { label: string; color: string; advice: string }> = {
  5: { label: '天作之合', color: 'text-green-400', advice: '你们是天生一对！默契十足，心灵相通，珍惜这段美好的缘分吧。' },
  4: { label: '非常般配', color: 'text-blue-400', advice: '你们的组合非常和谐，虽然偶有小摩擦，但整体运势很好。' },
  3: { label: '中等缘分', color: 'text-yellow-400', advice: '你们需要多一些耐心和理解，通过沟通可以增进感情。' },
  2: { label: '需要磨合', color: 'text-orange-400', advice: '你们的性格差异较大，但互补性强。学会欣赏彼此的不同。' },
  1: { label: '挑战较大', color: 'text-red-400', advice: '虽然挑战较多，但真爱可以跨越一切。需要更多的包容和付出。' },
}

export default function MatchPage() {
  const [partner1, setPartner1] = useState<number | null>(null)
  const [partner2, setPartner2] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleMatch = () => {
    if (partner1 === null || partner2 === null) return
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResult(true)
    }, 2000)
  }

  const handleReset = () => {
    setShowResult(false)
    setPartner1(null)
    setPartner2(null)
  }

  const score = partner1 !== null && partner2 !== null
    ? (compatibilityMatrix[zodiacSigns[partner1].name]?.[zodiacSigns[partner2].name] || 3)
    : 0

  const percentage = score * 20
  const compatInfo = compatibilityTexts[score] || compatibilityTexts[3]

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-gradient-gold">星座配对</span>
          </h1>
          <p className="text-mystical-300">选择两个星座，探索它们之间的化学反应与默契</p>
        </motion.div>

        {!showResult ? (
          <>
            {/* Partner Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Partner 1 */}
              <Card padding="lg">
                <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                  <Heart size={18} />
                  <span>TA 的星座</span>
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {zodiacSigns.map((z, i) => (
                    <motion.button
                      key={z.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPartner1(i)}
                      className={`p-2 rounded-xl border text-center transition-all duration-200 ${
                        partner1 === i
                          ? 'bg-gold-500/20 border-gold-500/50 text-gold'
                          : 'bg-mystical-800/50 border-mystical-600/20 text-mystical-300 hover:border-mystical-500/30'
                      }`}
                    >
                      <div className="text-xl mb-1">{z.icon}</div>
                      <div className="text-[10px] font-medium truncate">{z.name}</div>
                    </motion.button>
                  ))}
                </div>
              </Card>

              {/* Partner 2 */}
              <Card padding="lg">
                <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                  <Heart size={18} />
                  <span>TA 的星座</span>
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {zodiacSigns.map((z, i) => (
                    <motion.button
                      key={z.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPartner2(i)}
                      className={`p-2 rounded-xl border text-center transition-all duration-200 ${
                        partner2 === i
                          ? 'bg-gold-500/20 border-gold-500/50 text-gold'
                          : 'bg-mystical-800/50 border-mystical-600/20 text-mystical-300 hover:border-mystical-500/30'
                      }`}
                    >
                      <div className="text-xl mb-1">{z.icon}</div>
                      <div className="text-[10px] font-medium truncate">{z.name}</div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Selected Display */}
            {partner1 !== null && partner2 !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-4 bg-mystical-800/80 border border-mystical-600/30 rounded-2xl px-8 py-4">
                  <div className="text-center">
                    <div className="text-3xl mb-1">{zodiacSigns[partner1].icon}</div>
                    <div className="text-sm font-bold text-white">{zodiacSigns[partner1].name}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Heart size={24} className="text-pink-500 animate-pulse" />
                    <span className="text-xs text-mystical-400 mt-1">配对中</span>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-1">{zodiacSigns[partner2].icon}</div>
                    <div className="text-sm font-bold text-white">{zodiacSigns[partner2].name}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="gold" size="lg" onClick={handleMatch} loading={isAnalyzing}>
                    {isAnalyzing ? '分析中...' : '开始配对'}
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Heart Visualization */}
              <Card className="max-w-2xl mx-auto text-center" padding="lg">
                <div className="flex items-center justify-center gap-8 mb-8">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <div className="text-5xl mb-2">{zodiacSigns[partner1!].icon}</div>
                    <h3 className="text-lg font-bold text-white">{zodiacSigns[partner1!].name}</h3>
                    <p className="text-xs text-mystical-400">{zodiacSigns[partner1!].element}象星座</p>
                  </motion.div>

                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.5, damping: 10 }}
                      className="relative"
                    >
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                        <Heart size={32} className="text-white" fill="white" />
                      </div>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-pink-500/20"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <div className="text-5xl mb-2">{zodiacSigns[partner2!].icon}</div>
                    <h3 className="text-lg font-bold text-white">{zodiacSigns[partner2!].name}</h3>
                    <p className="text-xs text-mystical-400">{zodiacSigns[partner2!].element}象星座</p>
                  </motion.div>
                </div>

                {/* Score */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.8 }}
                >
                  <div className="relative inline-block mb-4">
                    <svg className="w-32 h-32" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(90,45,158,0.3)" strokeWidth="8" />
                      <motion.circle
                        cx="50" cy="50" r="40" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - percentage / 100) }}
                        transition={{ duration: 1.5, delay: 1 }}
                        transform="rotate(-90 50 50)"
                      />
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">{percentage}%</span>
                    </div>
                  </div>
                </motion.div>

                <h3 className={`text-2xl font-bold mb-2 ${compatInfo.color}`}>{compatInfo.label}</h3>
                <p className="text-sm text-mystical-300 max-w-md mx-auto">{compatInfo.advice}</p>
              </Card>

              {/* Detailed Analysis */}
              <Card className="max-w-2xl mx-auto" padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <Sparkles size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gold">AI 配对分析</h3>
                    <p className="text-xs text-mystical-400">基于星座特质与AI分析</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-mystical-900/50 rounded-xl p-4 border border-mystical-600/20">
                    <h4 className="font-bold text-white mb-2">综合配对指数</h4>
                    <div className="w-full h-3 bg-mystical-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                      />
                    </div>
                    <p className="text-sm text-mystical-300 mt-2">
                      {zodiacSigns[partner1!].name}与{zodiacSigns[partner2!].name}的配对指数为{percentage}分，属于「{compatInfo.label}」组合。
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-mystical-900/50 rounded-xl p-3 border border-mystical-600/20 text-center">
                      <div className="text-2xl font-bold text-green-400">{Math.min(percentage + 5, 100)}%</div>
                      <div className="text-xs text-mystical-400 mt-1">感情契合</div>
                    </div>
                    <div className="bg-mystical-900/50 rounded-xl p-3 border border-mystical-600/20 text-center">
                      <div className="text-2xl font-bold text-blue-400">{Math.max(percentage - 5, 20)}%</div>
                      <div className="text-xs text-mystical-400 mt-1">沟通默契</div>
                    </div>
                    <div className="bg-mystical-900/50 rounded-xl p-3 border border-mystical-600/20 text-center">
                      <div className="text-2xl font-bold text-yellow-400">{percentage}%</div>
                      <div className="text-xs text-mystical-400 mt-1">长期稳定</div>
                    </div>
                  </div>

                  <div className="bg-mystical-900/50 rounded-xl p-4 border border-mystical-600/20">
                    <h4 className="font-bold text-white mb-2">相处建议</h4>
                    <ul className="space-y-2 text-sm text-mystical-300">
                      <li>• {zodiacSigns[partner1!].name}的{zodiacSigns[partner1!].element}象特质与{zodiacSigns[partner2!].name}的{zodiacSigns[partner2!].element}象特质{score >= 4 ? '非常互补' : '需要磨合'}。</li>
                      <li>• 建议多进行深入沟通，增进彼此了解。</li>
                      <li>• {score >= 4 ? '珍惜这份美好的缘分，共同成长！' : '互相包容理解，感情会越来越好。'}</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <div className="text-center">
                <Button variant="gold" onClick={handleReset}>
                  重新配对
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Info */}
        <div className="mt-12 mb-8">
          <Card className="max-w-3xl mx-auto" padding="lg">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white mb-2">星座配对指南</h4>
                <ul className="space-y-2 text-sm text-mystical-300">
                  <li>• <span className="text-gold">火象星座</span>：白羊、狮子、射手 — 热情、直接、充满活力</li>
                  <li>• <span className="text-gold">土象星座</span>：金牛、处女、摩羯 — 稳重、务实、值得信赖</li>
                  <li>• <span className="text-gold">风象星座</span>：双子、天秤、水瓶 — 聪明、善变、追求自由</li>
                  <li>• <span className="text-gold">水象星座</span>：巨蟹、天蝎、双鱼 — 敏感、直觉、情感丰富</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
