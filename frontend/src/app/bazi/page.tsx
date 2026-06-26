'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Sparkles, Calendar, Clock, Info } from 'lucide-react'

const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

const fiveElements = ['金', '木', '水', '火', '土']
const elementColors: Record<string, string> = { '金': 'text-yellow-300', '木': 'text-green-400', '水': 'text-blue-400', '火': 'text-red-400', '土': 'text-amber-600' }
const elementBg: Record<string, string> = { '金': 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30', '木': 'from-green-500/20 to-green-600/20 border-green-500/30', '水': 'from-blue-500/20 to-blue-600/20 border-blue-500/30', '火': 'from-red-500/20 to-red-600/20 border-red-500/30', '土': 'from-amber-500/20 to-amber-600/20 border-amber-500/30' }

const dayMasterAnalysis: Record<string, { element: string, personality: string, career: string, love: string }> = {
  '甲': { element: '木', personality: '你如同参天大树，正直而坚韧，有领导才能', career: '适合管理、教育、创业等需要领导力的行业', love: '在感情中忠诚专一，但有时过于固执' },
  '乙': { element: '木', personality: '你如同藤蔓柔韧，善于适应环境，灵活变通', career: '适合艺术、设计、外交等需要灵活应变的领域', love: '温柔体贴，善于经营感情' },
  '丙': { element: '火', personality: '你如同太阳般温暖，热情开朗，富有感染力', career: '适合演艺、传媒、销售等需要表现力的工作', love: '热情奔放，追求浪漫' },
  '丁': { element: '火', personality: '你如同烛光般内敛，心思细腻，善于洞察', career: '适合研究、策划、咨询等需要深度思考的职业', love: '深情内敛，重视精神交流' },
  '戊': { element: '土', personality: '你如同高山般稳重，诚实可靠，值得信赖', career: '适合房产、金融、建筑等稳定型行业', love: '踏实稳重，给人安全感' },
  '己': { element: '土', personality: '你如同田园般包容，温和宽厚，乐于助人', career: '适合医疗、农业、服务等助人型工作', love: '贤惠温柔，善于照顾他人' },
  '庚': { element: '金', personality: '你如同刀剑般果断，刚毅果决，执行力强', career: '适合法律、军警、金融等需要决断力的行业', love: '直接坦率，重情重义' },
  '辛': { element: '金', personality: '你如同珠宝般精致，追求完美，审美力强', career: '适合珠宝、时尚、艺术等精致型行业', love: '浪漫优雅，注重品质' },
  '壬': { element: '水', personality: '你如同大海般深邃，智慧广博，适应力强', career: '适合科研、贸易、航海等流动性行业', love: '聪明机智，感情丰富' },
  '癸': { element: '水', personality: '你如同雨露般润泽，温柔细腻，直觉敏锐', career: '适合心理学、疗愈、文学等细腻型工作', love: '浪漫多情，善解人意' },
}

function getStemBranch(year: number) {
  const stemIdx = (year - 4) % 10
  const branchIdx = (year - 4) % 12
  return { stem: heavenlyStems[stemIdx], branch: earthlyBranches[branchIdx] }
}

export default function BaziPage() {
  const [birthDate, setBirthDate] = useState('')
  const [birthHour, setBirthHour] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const hours = Array.from({ length: 12 }, (_, i) => ({
    value: `${i * 2}:00`,
    label: `${earthlyBranches[i]}时 (${i * 2}:00-${i * 2 + 2}:00)`,
  }))

  const handleAnalyze = () => {
    if (!birthDate) return
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResult(true)
    }, 2000)
  }

  const handleReset = () => {
    setShowResult(false)
    setBirthDate('')
    setBirthHour('')
  }

  const year = birthDate ? new Date(birthDate).getFullYear() : new Date().getFullYear()
  const month = birthDate ? new Date(birthDate).getMonth() + 1 : 1
  const day = birthDate ? new Date(birthDate).getDate() : 1

  const yearSB = getStemBranch(year)
  const monthSB = getStemBranch(year * 12 + month)
  const daySB = getStemBranch(year * 365 + month * 30 + day)
  const hourIdx = birthHour ? parseInt(birthHour.split(':')[0]) / 2 : 0
  const hourSB = { stem: heavenlyStems[(daySB.stem.charCodeAt(0) - 0x4e00 + hourIdx) % 10], branch: earthlyBranches[hourIdx] }

  const dayMaster = daySB.stem
  const dayMasterInfo = dayMasterAnalysis[dayMaster] || dayMasterAnalysis['甲']

  const zodiacIdx = (year - 4) % 12
  const zodiac = zodiacAnimals[zodiacIdx]

  const pillars = [
    { label: '年柱', stem: yearSB.stem, branch: yearSB.branch },
    { label: '月柱', stem: monthSB.stem, branch: monthSB.branch },
    { label: '日柱', stem: daySB.stem, branch: daySB.branch },
    { label: '时柱', stem: hourSB.stem, branch: hourSB.branch },
  ]

  // Count five elements
  const allChars = pillars.map(p => p.stem + p.branch).join('')
  const elementCounts: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
  const stemElements: Record<string, string> = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' }
  pillars.forEach(p => {
    const el = stemElements[p.stem]
    if (el) elementCounts[el]++
  })

  const maxCount = Math.max(...Object.values(elementCounts))

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-gradient-gold">八字命理</span>
          </h1>
          <p className="text-mystical-300">输入出生信息，解读生辰八字，洞察命理玄机</p>
        </motion.div>

        {!showResult ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="max-w-lg mx-auto" padding="lg">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-mystical-200">
                    <Calendar size={14} className="inline mr-2" />出生日期
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-mystical-900/50 border border-mystical-600/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-mystical-200">
                    <Clock size={14} className="inline mr-2" />出生时辰
                  </label>
                  <select
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    className="w-full bg-mystical-900/50 border border-mystical-600/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all duration-200 appearance-none"
                  >
                    <option value="">请选择时辰</option>
                    {hours.map(h => (
                      <option key={h.value} value={h.value}>{h.label}</option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-mystical-400 bg-mystical-900/30 rounded-lg p-3 border border-mystical-600/10">
                  💡 出生时辰影响八字的准确性，如不确定可选择大致时段
                </div>

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={handleAnalyze}
                  disabled={!birthDate}
                  loading={isAnalyzing}
                >
                  {isAnalyzing ? '分析中...' : '开始分析'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Four Pillars Display */}
              <Card padding="lg">
                <h3 className="text-lg font-bold text-gold mb-4 text-center">命盘</h3>
                <div className="grid grid-cols-4 gap-3">
                  {pillars.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.15 }}
                      className={`text-center p-4 rounded-xl bg-gradient-to-b ${elementBg[stemElements[p.stem]] || 'from-mystical-700/20 to-mystical-800/20 border-mystical-600/20'} border`}
                    >
                      <div className="text-xs text-mystical-400 mb-3">{p.label}</div>
                      <div className="text-2xl font-bold text-gold mb-1">{p.stem}</div>
                      <div className="text-2xl font-bold text-white mb-2">{p.branch}</div>
                      <div className={`text-xs ${elementColors[stemElements[p.stem]] || 'text-mystical-300'}`}>
                        {stemElements[p.stem]}天干
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <span className="text-sm text-mystical-300">生肖：</span>
                  <span className="text-gold font-bold">{zodiac}</span>
                  <span className="text-sm text-mystical-300 ml-4">日主：</span>
                  <span className="text-gold font-bold">{dayMaster}</span>
                  <span className={`ml-1 ${elementColors[dayMasterInfo.element]}`}>({dayMasterInfo.element})</span>
                </div>
              </Card>

              {/* Five Elements Balance */}
              <Card padding="lg">
                <h3 className="text-lg font-bold text-gold mb-4">五行分布</h3>
                <div className="space-y-3">
                  {fiveElements.map(el => (
                    <div key={el} className="flex items-center gap-3">
                      <span className={`text-sm font-bold w-8 ${elementColors[el]}`}>{el}</span>
                      <div className="flex-1 h-4 bg-mystical-900/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(elementCounts[el] / Math.max(maxCount, 1)) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            el === '金' ? 'bg-yellow-400' : el === '木' ? 'bg-green-400' : el === '水' ? 'bg-blue-400' : el === '火' ? 'bg-red-400' : 'bg-amber-500'
                          }`}
                        />
                      </div>
                      <span className="text-sm text-mystical-300 w-6 text-right">{elementCounts[el]}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Day Master Analysis */}
              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <Sparkles size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gold">AI 命理解读</h3>
                    <p className="text-xs text-mystical-400">基于八字命理与AI分析</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-mystical-900/50 rounded-xl p-4 border border-mystical-600/20">
                    <h4 className="font-bold text-white mb-2">性格特征</h4>
                    <p className="text-sm text-mystical-300 leading-relaxed">{dayMasterInfo.personality}</p>
                  </div>
                  <div className="bg-mystical-900/50 rounded-xl p-4 border border-mystical-600/20">
                    <h4 className="font-bold text-white mb-2">事业运势</h4>
                    <p className="text-sm text-mystical-300 leading-relaxed">{dayMasterInfo.career}</p>
                  </div>
                  <div className="bg-mystical-900/50 rounded-xl p-4 border border-mystical-600/20">
                    <h4 className="font-bold text-white mb-2">感情运势</h4>
                    <p className="text-sm text-mystical-300 leading-relaxed">{dayMasterInfo.love}</p>
                  </div>
                </div>
              </Card>

              <div className="text-center">
                <Button variant="gold" onClick={handleReset}>
                  重新分析
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
                <h4 className="font-bold text-white mb-2">八字命理简介</h4>
                <ul className="space-y-2 text-sm text-mystical-300">
                  <li>• <span className="text-gold">八字</span>：由出生年、月、日、时的天干地支组成</li>
                  <li>• <span className="text-gold">四柱</span>：年柱、月柱、日柱、时柱各含天干地支</li>
                  <li>• <span className="text-gold">五行</span>：金、木、水、火、土五行的平衡影响命运</li>
                  <li>• <span className="text-gold">日主</span>：日柱天干代表命主自身</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
