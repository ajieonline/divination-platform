'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Sparkles, Moon, Info, RefreshCw } from 'lucide-react'

const sampleDreams = [
  '梦见自己在飞翔，飞过了高山和大海',
  '梦见一条大蛇在水中游动',
  '梦见自己回到了小时候的家',
  '梦见在考试，但是什么都不会',
  '梦见牙齿掉了',
  '梦见自己迷路了，找不到方向',
  '梦见下雨了，自己在雨中奔跑',
  '梦见捡到了很多金币',
]

const dreamAnalysis: Record<string, { category: string; meaning: string; advice: string; lucky: string }> = {
  '飞翔': {
    category: '自由与超越',
    meaning: '梦见飞翔通常象征着对自由的渴望和对现状的超越。你可能正在寻求突破生活中的某些限制，或者内心有一种强烈的自我实现的冲动。',
    advice: '这是积极的信号！你正在经历个人成长。建议勇敢追求自己的目标，不要被现实的束缚所困扰。',
    lucky: '紫色',
  },
  '蛇': {
    category: '智慧与转变',
    meaning: '蛇在梦境中往往代表智慧、转变和潜意识的力量。水中的蛇暗示你的情感世界正在经历一些深层的变化。',
    advice: '注意自己内心的感受，可能会有一些重要的直觉出现。信任你的第六感。',
    lucky: '蓝色',
  },
  '回家': {
    category: '回归与思念',
    meaning: '梦见回家或回到过去的地方，通常代表着对安全感的渴望，或者对过去美好时光的怀念。这也可能暗示你需要重新审视一些旧有的关系或习惯。',
    advice: '这是一个提醒，让你关注自己内心真正需要的东西。也许该和老朋友联系了。',
    lucky: '绿色',
  },
  '考试': {
    category: '压力与自我评价',
    meaning: '梦见考试是最常见的梦境之一，通常反映了你对自我能力的评估和面对挑战时的焦虑感。这可能与工作、学习或生活中的某个重要决定有关。',
    advice: '适当放松自己，不要给自己太大压力。你已经做得很好了，相信自己的能力。',
    lucky: '黄色',
  },
  '牙齿': {
    category: '自信与表达',
    meaning: '梦见牙齿脱落通常与自信心、表达能力或对外表的担忧有关。你可能在某些方面感到不安或不确定。',
    advice: '增强自信心，相信自己的价值。如果有什么想说的话，勇敢表达出来。',
    lucky: '白色',
  },
  '迷路': {
    category: '方向与选择',
    meaning: '梦见迷路反映了你对当前生活方向的迷茫或对未来的不确定性。你可能正在面临一个重要的选择。',
    advice: '不要急于做决定，给自己一些时间思考。可以向信任的人寻求建议。',
    lucky: '金色',
  },
  '雨': {
    category: '情感与净化',
    meaning: '雨在梦中通常代表情感的释放和净化。下雨可能暗示你正在经历或即将经历一些情感上的变化。',
    advice: '允许自己感受情绪，不要压抑。这是一个情感净化的过程，之后会更加轻松。',
    lucky: '蓝色',
  },
  '金币': {
    category: '财富与机遇',
    meaning: '梦见金币通常是好运的象征，暗示你可能即将迎来一些财务上的好消息或新的机遇。',
    advice: '保持积极的心态，把握眼前的机会。财运不错，可以适当尝试新的投资或事业。',
    lucky: '金色',
  },
}

function analyzeDream(dream: string): { category: string; meaning: string; advice: string; lucky: string } {
  const keywords = Object.keys(dreamAnalysis)
  for (const keyword of keywords) {
    if (dream.includes(keyword)) {
      return dreamAnalysis[keyword]
    }
  }
  // Default analysis
  return {
    category: '潜意识探索',
    meaning: '你的梦境反映了内心深处的想法和感受。这个梦境可能暗示着你最近的生活状态和心理状态。梦境中的场景和情感是你潜意识的表达，值得你深入思考。',
    advice: '建议你记录下这个梦境的细节，观察接下来几天生活中是否有一些相关的提示。保持对内心声音的敏感度。',
    lucky: '紫色',
  }
}

export default function DreamPage() {
  const [dreamText, setDreamText] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeDream> | null>(null)

  const handleAnalyze = () => {
    if (!dreamText.trim()) return
    setIsAnalyzing(true)
    setTimeout(() => {
      const result = analyzeDream(dreamText)
      setAnalysis(result)
      setIsAnalyzing(false)
      setShowResult(true)
    }, 2000)
  }

  const handleReset = () => {
    setShowResult(false)
    setDreamText('')
    setAnalysis(null)
  }

  const handleSampleDream = (dream: string) => {
    setDreamText(dream)
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
            <span className="text-gradient-gold">解梦大全</span>
          </h1>
          <p className="text-mystical-300">输入你的梦境，AI为你解读梦中的密码</p>
        </motion.div>

        {!showResult ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="max-w-2xl mx-auto" padding="lg">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-mystical-200">
                    <Moon size={14} className="inline mr-2" />描述你的梦境
                  </label>
                  <textarea
                    value={dreamText}
                    onChange={(e) => setDreamText(e.target.value)}
                    placeholder="请详细描述你的梦境内容，包括场景、人物、情感等细节..."
                    rows={6}
                    className="w-full bg-mystical-900/50 border border-mystical-600/30 rounded-xl px-4 py-3 text-white placeholder-mystical-400 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all duration-200 resize-none"
                  />
                  <div className="flex justify-between text-xs text-mystical-500">
                    <span>描述越详细，解读越准确</span>
                    <span>{dreamText.length} 字</span>
                  </div>
                </div>

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={handleAnalyze}
                  disabled={!dreamText.trim()}
                  loading={isAnalyzing}
                >
                  {isAnalyzing ? '解读中...' : '开始解梦'}
                </Button>
              </div>
            </Card>

            {/* Sample Dreams */}
            <div className="max-w-2xl mx-auto mt-6">
              <h3 className="text-sm font-medium text-mystical-300 mb-3">💡 热门梦境示例</h3>
              <div className="flex flex-wrap gap-2">
                {sampleDreams.map((dream, i) => (
                  <button
                    key={i}
                    onClick={() => handleSampleDream(dream)}
                    className="px-3 py-1.5 text-xs text-mystical-300 bg-mystical-800/50 border border-mystical-600/20 rounded-full hover:border-gold-500/30 hover:text-gold transition-all duration-200"
                  >
                    {dream.substring(0, 15)}...
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Dream Summary */}
              <Card className="max-w-3xl mx-auto" padding="lg">
                <div className="bg-mystical-900/50 rounded-xl p-4 border border-mystical-600/20 mb-4">
                  <p className="text-xs text-mystical-400 mb-1">你的梦境</p>
                  <p className="text-mystical-200">{dreamText}</p>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Moon size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gold">AI 解梦分析</h3>
                    <p className="text-xs text-mystical-400">基于梦境心理学与AI分析</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-mystical-900/50 rounded-xl p-4 border border-mystical-600/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-400 rounded-full">{analysis?.category}</span>
                    </div>
                    <h4 className="font-bold text-white mb-2">梦境解析</h4>
                    <p className="text-sm text-mystical-300 leading-relaxed">{analysis?.meaning}</p>
                  </div>

                  <div className="bg-gold-500/5 rounded-xl p-4 border border-gold-500/20">
                    <h4 className="font-bold text-gold mb-2">💡 建议</h4>
                    <p className="text-sm text-mystical-200 leading-relaxed">{analysis?.advice}</p>
                  </div>

                  <div className="bg-mystical-900/50 rounded-xl p-4 border border-mystical-600/20 flex items-center gap-3">
                    <div className="text-2xl">🎨</div>
                    <div>
                      <span className="text-xs text-mystical-400">建议关注的颜色</span>
                      <p className="text-gold font-bold">{analysis?.lucky}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="text-center">
                <Button variant="gold" onClick={handleReset}>
                  <RefreshCw size={18} className="mr-2" />
                  解读新梦境
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
                <h4 className="font-bold text-white mb-2">解梦小贴士</h4>
                <ul className="space-y-2 text-sm text-mystical-300">
                  <li>• <span className="text-gold">记录细节</span>：梦境醒来后尽快记录，避免遗忘</li>
                  <li>• <span className="text-gold">关注情感</span>：梦中的情绪往往比场景更重要</li>
                  <li>• <span className="text-gold">反复出现</span>：重复的梦境可能有更深层的含义</li>
                  <li>• <span className="text-gold">参考但不迷信</span>：梦境解读仅供参考</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
