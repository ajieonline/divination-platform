'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { PenTool, Sparkles, Info, RefreshCw } from 'lucide-react'

const fiveElements = {
  '金': { color: 'text-yellow-300', bg: 'from-yellow-500/20 to-yellow-600/20', symbol: '⚔️', traits: '刚毅、果断、义气', personality: '你如同锋利的宝剑，性格刚毅果决，有强烈的正义感。做事果断，不拖泥带水，是值得信赖的朋友。' },
  '木': { color: 'text-green-400', bg: 'from-green-500/20 to-green-600/20', symbol: '🌳', traits: '正直、向上、仁慈', personality: '你如同参天大树，正直而向上生长。心地善良，乐于助人，有很强的生命力和成长力。' },
  '水': { color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/20', symbol: '💧', traits: '智慧、灵活、包容', personality: '你如同清澈的流水，智慧而灵活。善于适应环境，有很强的包容心和洞察力。' },
  '火': { color: 'text-red-400', bg: 'from-red-500/20 to-red-600/20', symbol: '🔥', traits: '热情、光明、礼仪', personality: '你如同耀眼的火焰，热情洋溢，充满感染力。天生具有领导气质，做事光明磊落。' },
  '土': { color: 'text-amber-500', bg: 'from-amber-500/20 to-amber-600/20', symbol: '🏔️', traits: '稳重、厚实、诚信', personality: '你如同厚重的大地，稳重而踏实。为人忠厚老实，值得信赖，是团队中的中坚力量。' },
}

const nameElements: Record<string, string> = {
  '一': '水', '二': '水', '三': '木', '四': '金', '五': '土', '六': '水', '七': '金', '八': '木', '九': '火', '十': '金',
  '天': '火', '地': '土', '人': '金', '大': '火', '小': '金', '中': '土', '上': '水', '下': '水',
  '明': '火', '亮': '火', '暗': '水', '光': '火', '星': '金', '月': '水', '日': '火', '云': '水',
  '风': '水', '雨': '水', '雪': '水', '山': '土', '石': '土', '林': '木', '森': '木', '花': '木',
  '草': '木', '树': '木', '水': '水', '火': '火', '金': '金', '木': '木', '土': '土',
  '龙': '火', '凤': '火', '虎': '木', '鹤': '金', '鹏': '火', '燕': '金',
  '华': '水', '丽': '火', '美': '水', '好': '水', '善': '金', '德': '火',
  '志': '火', '勇': '木', '强': '木', '刚': '金', '柔': '水', '和': '水',
  '玉': '金', '珠': '金', '宝': '火', '珍': '火', '兰': '木', '梅': '木',
  '红': '火', '白': '金', '青': '木', '紫': '火', '黄': '土', '绿': '木',
  '春': '木', '夏': '火', '秋': '金', '冬': '水', '东': '木', '西': '金', '南': '火', '北': '水',
  '安': '土', '平': '水', '乐': '火', '福': '水', '祥': '金', '瑞': '金',
  '文': '水', '武': '木', '学': '水', '书': '金', '画': '水', '诗': '金',
  '心': '金', '意': '土', '情': '火', '爱': '土', '思': '金', '念': '火',
  '竹': '木', '菊': '木', '松': '木', '柏': '木',
  '飞': '水', '翔': '金', '远': '土', '近': '金', '高': '木',
  '国': '木', '家': '土', '民': '水', '王': '土', '君': '木', '臣': '金',
}

function getCharElement(char: string): string {
  if (nameElements[char]) return nameElements[char]
  // Simple: use stroke-based mapping
  const code = char.charCodeAt(0)
  const elements = ['金', '木', '水', '火', '土']
  return elements[code % 5]
}

function analyzeName(name: string) {
  const chars = name.split('')
  const elements = chars.map(c => getCharElement(c))
  const elementCounts: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
  elements.forEach(el => { elementCounts[el]++ })

  const dominant = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0]
  const dominantElement = dominant[0]

  // Name scores based on element harmony
  const hasAllFive = Object.values(elementCounts).filter(c => c > 0).length >= 3
  const harmonyScore = hasAllFive ? 85 + Math.floor(Math.random() * 15) : 60 + Math.floor(Math.random() * 25)

  const overallFortunes = [
    '此名五行相生相克平衡，预示着人生道路宽广，事业有成。',
    '姓名蕴含的能量场与你的命格相合，有助于发挥个人优势。',
    '名字中的五元素配置独特，暗示你有非凡的创造力和领导力。',
    '此名五行流通顺畅，代表着生活中处处有贵人相助。',
  ]

  return {
    chars,
    elements,
    elementCounts,
    dominantElement,
    harmonyScore,
    overallFortune: overallFortunes[name.length % overallFortunes.length],
  }
}

export default function NamePage() {
  const [name, setName] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeName> | null>(null)

  const handleAnalyze = () => {
    if (!name.trim()) return
    setIsAnalyzing(true)
    setTimeout(() => {
      const result = analyzeName(name)
      setAnalysis(result)
      setIsAnalyzing(false)
      setShowResult(true)
    }, 2000)
  }

  const handleReset = () => {
    setShowResult(false)
    setName('')
    setAnalysis(null)
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
            <span className="text-gradient-gold">姓名测试</span>
          </h1>
          <p className="text-mystical-300">输入姓名，分析五行能量与运势</p>
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
                    <PenTool size={14} className="inline mr-2" />输入姓名
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="请输入中文姓名"
                    maxLength={10}
                    className="w-full bg-mystical-900/50 border border-mystical-600/30 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-[0.3em] placeholder:text-mystical-400 placeholder:text-base placeholder:tracking-normal focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all duration-200"
                  />
                  <div className="text-xs text-mystical-500 text-right">{name.length}/10</div>
                </div>

                {name.length > 0 && (
                  <div className="flex justify-center gap-2">
                    {name.split('').map((char, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-12 h-12 rounded-xl bg-mystical-700/50 border border-mystical-500/30 flex items-center justify-center text-lg font-bold text-gold"
                      >
                        {char}
                      </motion.div>
                    ))}
                  </div>
                )}

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={handleAnalyze}
                  disabled={!name.trim()}
                  loading={isAnalyzing}
                >
                  {isAnalyzing ? '分析中...' : '开始测试'}
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
              {/* Character Analysis */}
              <Card className="max-w-3xl mx-auto" padding="lg">
                <h3 className="text-lg font-bold text-gold mb-4 text-center">姓名五行分析</h3>
                <div className="flex justify-center gap-3 mb-6">
                  {analysis?.chars.map((char, i) => {
                    const el = analysis.elements[i]
                    const elInfo = fiveElements[el as keyof typeof fiveElements]
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className={`text-center p-4 rounded-xl bg-gradient-to-b ${elInfo.bg} border border-mystical-600/20`}
                      >
                        <div className="text-3xl font-bold text-gold mb-1">{char}</div>
                        <div className="text-2xl mb-1">{elInfo.symbol}</div>
                        <div className={`text-sm font-bold ${elInfo.color}`}>{el}</div>
                        <div className="text-[10px] text-mystical-400 mt-1">{elInfo.traits}</div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Five Elements Chart */}
                <div className="space-y-3">
                  {Object.entries(analysis?.elementCounts || {}).map(([el, count]) => {
                    const elInfo = fiveElements[el as keyof typeof fiveElements]
                    return (
                      <div key={el} className="flex items-center gap-3">
                        <span className={`text-sm font-bold w-8 ${elInfo.color}`}>{el}</span>
                        <div className="flex-1 h-4 bg-mystical-900/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(count / Math.max(analysis?.chars.length || 1, 1)) * 100}%` }}
                            transition={{ duration: 0.8 }}
                            className={`h-full rounded-full ${
                              el === '金' ? 'bg-yellow-400' : el === '木' ? 'bg-green-400' : el === '水' ? 'bg-blue-400' : el === '火' ? 'bg-red-400' : 'bg-amber-500'
                            }`}
                          />
                        </div>
                        <span className="text-sm text-mystical-300 w-6 text-right">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </Card>

              {/* Detailed Analysis */}
              <Card className="max-w-3xl mx-auto" padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <Sparkles size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gold">AI 姓名解读</h3>
                    <p className="text-xs text-mystical-400">基于五行学说与AI分析</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Dominant Element */}
                  <div className="bg-mystical-900/50 rounded-xl p-4 border border-mystical-600/20">
                    <h4 className="font-bold text-white mb-2">
                      主导五行：
                      <span className={fiveElements[analysis?.dominantElement as keyof typeof fiveElements]?.color}>
                        {analysis?.dominantElement}
                      </span>
                    </h4>
                    <p className="text-sm text-mystical-300 leading-relaxed">
                      {fiveElements[analysis?.dominantElement as keyof typeof fiveElements]?.personality}
                    </p>
                  </div>

                  {/* Harmony Score */}
                  <div className="bg-mystical-900/50 rounded-xl p-4 border border-mystical-600/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-mystical-300">姓名能量指数</span>
                      <span className={`text-lg font-bold ${
                        (analysis?.harmonyScore || 0) >= 80 ? 'text-green-400' : (analysis?.harmonyScore || 0) >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {analysis?.harmonyScore}分
                      </span>
                    </div>
                    <div className="w-full h-3 bg-mystical-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis?.harmonyScore || 0}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Overall Fortune */}
                  <div className="bg-gold-500/5 border border-gold-500/20 rounded-xl p-4">
                    <h4 className="font-bold text-gold mb-2">综合运势</h4>
                    <p className="text-sm text-mystical-200 leading-relaxed">{analysis?.overallFortune}</p>
                  </div>
                </div>
              </Card>

              <div className="text-center">
                <Button variant="gold" onClick={handleReset}>
                  <RefreshCw size={18} className="mr-2" />
                  重新测试
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
                <h4 className="font-bold text-white mb-2">姓名五行简介</h4>
                <ul className="space-y-2 text-sm text-mystical-300">
                  <li>• <span className="text-gold">金</span>：刚毅果断，代表勇气与决断力</li>
                  <li>• <span className="text-gold">木</span>：生机勃勃，代表成长与仁慈</li>
                  <li>• <span className="text-gold">水</span>：智慧灵活，代表包容与洞察</li>
                  <li>• <span className="text-gold">火</span>：热情光明，代表礼仪与领导力</li>
                  <li>• <span className="text-gold">土</span>：稳重厚实，代表诚信与承载</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
