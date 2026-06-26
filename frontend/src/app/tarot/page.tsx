'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tabs from '@/components/ui/Tabs'
import { Sparkles, RotateCcw, Info } from 'lucide-react'

const tarotCards = [
  { id: 1, name: '愚者', nameEn: 'The Fool', meaning: '新的开始，无限可能', image: '🃏' },
  { id: 2, name: '魔术师', nameEn: 'The Magician', meaning: '创造力，技能，自信', image: '✨' },
  { id: 3, name: '女祭司', nameEn: 'The High Priestess', meaning: '直觉，潜意识，神秘', image: '🌙' },
  { id: 4, name: '女皇', nameEn: 'The Empress', meaning: '丰收，母性，自然', image: '👑' },
  { id: 5, name: '皇帝', nameEn: 'The Emperor', meaning: '权威，稳定，领导力', image: '🏛️' },
  { id: 6, name: '教皇', nameEn: 'The Hierophant', meaning: '传统，智慧，信仰', image: '📿' },
  { id: 7, name: '恋人', nameEn: 'The Lovers', meaning: '爱情，和谐，选择', image: '💕' },
  { id: 8, name: '战车', nameEn: 'The Chariot', meaning: '胜利，意志力，决心', image: '⚔️' },
  { id: 9, name: '力量', nameEn: 'Strength', meaning: '勇气，耐心，内在力量', image: '🦁' },
  { id: 10, name: '隐士', nameEn: 'The Hermit', meaning: '内省，智慧，孤独', image: '🏔️' },
  { id: 11, name: '命运之轮', nameEn: 'Wheel of Fortune', meaning: '变化，命运，转机', image: '🎡' },
  { id: 12, name: '正义', nameEn: 'Justice', meaning: '公正，平衡，因果', image: '⚖️' },
  { id: 13, name: '倒吊人', nameEn: 'The Hanged Man', meaning: '牺牲，等待，新视角', image: '🔄' },
  { id: 14, name: '死神', nameEn: 'Death', meaning: '结束与新生，转变', image: '🦅' },
  { id: 15, name: '节制', nameEn: 'Temperance', meaning: '平衡，耐心，调和', image: '🏺' },
  { id: 16, name: '恶魔', nameEn: 'The Devil', meaning: '束缚，诱惑，阴暗面', image: '⛓️' },
  { id: 17, name: '塔', nameEn: 'The Tower', meaning: '颠覆，觉醒，重建', image: '🗼' },
  { id: 18, name: '星星', nameEn: 'The Star', meaning: '希望，灵感，宁静', image: '⭐' },
  { id: 19, name: '月亮', nameEn: 'The Moon', meaning: '幻觉，潜意识，不安', image: '🌕' },
  { id: 20, name: '太阳', nameEn: 'The Sun', meaning: '快乐，成功，活力', image: '☀️' },
  { id: 21, name: '审判', nameEn: 'Judgement', meaning: '觉醒，重生，召唤', image: '📯' },
  { id: 22, name: '世界', nameEn: 'The World', meaning: '完成，圆满，成就', image: '🌍' },
]

const spreadOptions = [
  { key: 'single', label: '单牌占卜' },
  { key: 'three', label: '三牌阵' },
  { key: 'celtic', label: '凯尔特十字' },
]

const positionLabels: Record<string, string[]> = {
  single: ['当前指引'],
  three: ['过去', '现在', '未来'],
  celtic: ['当前情况', '挑战', '过去基础', '近期未来', '可能结果', '自我意识', '外部影响', '希望恐惧', '最终结果'],
}

function TarotCard({ card, isFlipped, onClick, index }: { card: any; isFlipped: boolean; onClick: () => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, type: 'spring' }}
      className="cursor-pointer perspective-1000"
      onClick={onClick}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-28 h-44 sm:w-32 sm:h-48"
      >
        {/* Card Back */}
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-mystical-700 via-mystical-800 to-mystical-900 border-2 border-gold-500/30 flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent" />
          <div className="relative text-center">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full border-2 border-gold-500/40 flex items-center justify-center">
              <Sparkles size={24} className="text-gold" />
            </div>
            <div className="w-20 h-0.5 bg-gold-500/30 mx-auto rounded-full" />
          </div>
          <div className="absolute inset-2 border border-gold-500/10 rounded-lg" />
        </div>

        {/* Card Front */}
        <div
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-mystical-600 to-mystical-800 border-2 border-gold-500/50 flex flex-col items-center justify-center p-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gold-500/10 to-transparent" />
          <div className="relative text-center">
            <div className="text-4xl mb-2">{card.image}</div>
            <h4 className="text-sm font-bold text-gold">{card.name}</h4>
            <p className="text-[10px] text-mystical-300 mt-1">{card.nameEn}</p>
          </div>
          <div className="absolute inset-2 border border-gold-500/10 rounded-lg" />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function TarotPage() {
  const [spreadType, setSpreadType] = useState('single')
  const [selectedCards, setSelectedCards] = useState<any[]>([])
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [showResult, setShowResult] = useState(false)
  const [isReading, setIsReading] = useState(false)

  const cardCount = spreadType === 'single' ? 1 : spreadType === 'three' ? 3 : 9

  const handleSelectCard = (card: any) => {
    if (selectedCards.find(c => c.id === card.id)) return
    if (selectedCards.length >= cardCount) return

    const newSelected = [...selectedCards, card]
    setSelectedCards(newSelected)

    setTimeout(() => {
      setFlippedCards(prev => new Set([...prev, card.id]))
    }, 300)

    if (newSelected.length === cardCount) {
      setTimeout(() => {
        setIsReading(true)
        setTimeout(() => {
          setShowResult(true)
          setIsReading(false)
        }, 2000)
      }, 1000)
    }
  }

  const handleReset = () => {
    setSelectedCards([])
    setFlippedCards(new Set())
    setShowResult(false)
    setIsReading(false)
  }

  const getInterpretation = (card: any, position: string) => {
    const interpretations: Record<string, string> = {
      '当前情况': `${card.name}出现在当前位置，暗示你正面临着一个重要的转折点。这张牌提醒你需要用全新的视角来看待当前的处境。`,
      '挑战': `${card.name}提示你需要面对的挑战。这可能涉及到需要放下某些执念，或者勇敢地迈出新的一步。`,
      '过去基础': `${card.name}代表了塑造你当前处境的过去因素。这些经历为你提供了宝贵的经验和教训。`,
      '近期未来': `${card.name}预示着即将到来的变化。保持开放的心态，新的机遇正在向你招手。`,
      '可能结果': `${card.name}揭示了如果按照目前的趋势发展，可能达到的结果。`,
      '自我意识': `${card.name}反映了你内心深处的想法和感受。`,
      '外部影响': `${card.name}代表了外界环境对你的影响。`,
      '希望恐惧': `${card.name}揭示了你内心深处的期望与担忧。`,
      '最终结果': `${card.name}代表了整个事件的最终走向。`,
      '过去': `${card.name}代表了过去的影响。这段经历为现在奠定了基础。`,
      '现在': `${card.name}反映了你当前的状态。这是理解现状的关键。`,
      '未来': `${card.name}预示着未来的发展方向。保持信心，美好的变化即将到来。`,
      '当前指引': `${card.name}给予你的核心指引：${card.meaning}。这张牌鼓励你保持开放的心态，拥抱生活中的变化与机遇。`,
    }
    return interpretations[position] || `${card.name}的含义：${card.meaning}`
  }

  const getOverallReading = () => {
    if (spreadType === 'single') {
      return `🌟 整体解读：\n\n${selectedCards[0]?.name}（${selectedCards[0]?.nameEn}）\n\n核心含义：${selectedCards[0]?.meaning}\n\n这张牌为你带来了重要的启示。它提醒我们，在人生的旅途中，每一张牌都有其独特的智慧要传递给你。保持内心的平静与觉知，让这张牌的智慧引导你的前行。\n\n建议：用冥想的方式深入理解这张牌的信息，让它成为你生活中的指引。`
    }
    if (spreadType === 'three') {
      return `🌟 三牌阵解读：\n\n【过去】${selectedCards[0]?.name} - ${selectedCards[0]?.meaning}\n\n【现在】${selectedCards[1]?.name} - ${selectedCards[1]?.meaning}\n\n【未来】${selectedCards[2]?.name} - ${selectedCards[2]?.meaning}\n\n这三张牌描绘了你的过去、现在和未来。它们之间的联系揭示了一个清晰的故事线：过去的经历正在影响你的现在，而现在的选择将塑造你的未来。\n\n建议：从过去的牌中汲取教训，关注当下的选择，为美好的未来做好准备。`
    }
    return `🌟 凯尔特十字解读：\n\n这是一个全面而深入的解读。九张牌从不同角度揭示了你的处境：当前情况、面临的挑战、过去的基础、近期的发展、可能的结果，以及你的内心世界和外部环境。\n\n核心信息：你正处于一个关键的转变期。虽然挑战存在，但星星牌（希望）和太阳牌（成功）的能量正在向你靠近。保持信心，相信自己的直觉。\n\n建议：多花时间倾听内心的声音，不要忽视直觉的指引。与信任的人分享你的想法，他们的视角可能会给你带来新的启发。`
  }

  const positions = positionLabels[spreadType] || []

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-gradient-gold">塔罗占卜</span>
          </h1>
          <p className="text-mystical-300">选择牌阵，静心冥想，让塔罗牌为你揭示命运的指引</p>
        </motion.div>

        {/* Spread Type Selection */}
        <div className="mb-8 max-w-md mx-auto">
          <Tabs tabs={spreadOptions} activeTab={spreadType} onChange={(key) => { setSpreadType(key); handleReset() }} />
        </div>

        {/* Card Selection Area */}
        {!showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <div className="text-center mb-6">
              <p className="text-mystical-300 text-sm">
                请选择 <span className="text-gold font-bold">{cardCount}</span> 张牌（已选 {selectedCards.length}/{cardCount}）
              </p>
            </div>

            {/* Selected Cards Display */}
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              {positions.map((pos, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs text-mystical-400 mb-2">{pos}</p>
                  {selectedCards[i] ? (
                    <TarotCard
                      card={selectedCards[i]}
                      isFlipped={flippedCards.has(selectedCards[i].id)}
                      onClick={() => {}}
                      index={i}
                    />
                  ) : (
                    <div className="w-28 h-44 sm:w-32 sm:h-48 rounded-xl border-2 border-dashed border-mystical-600/30 flex items-center justify-center">
                      <span className="text-mystical-500 text-sm">待选</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Available Cards */}
            {selectedCards.length < cardCount && (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-3 justify-items-center">
                {tarotCards.filter(c => !selectedCards.find(s => s.id === c.id)).map((card, i) => (
                  <TarotCard
                    key={card.id}
                    card={card}
                    isFlipped={false}
                    onClick={() => handleSelectCard(card)}
                    index={i}
                  />
                ))}
              </div>
            )}

            {selectedCards.length > 0 && !showResult && (
              <div className="text-center mt-6">
                <Button variant="ghost" onClick={handleReset} className="text-mystical-400">
                  <RotateCcw size={16} className="mr-2" />
                  重新选择
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* Reading in Progress */}
        <AnimatePresence>
          {isReading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gold-500/30 border-t-gold-500"
              />
              <p className="text-gold text-lg">正在解读命运的密码...</p>
              <p className="text-mystical-400 text-sm mt-2">请静心等待</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Result Cards */}
              <div className="flex justify-center gap-4 mb-8 flex-wrap">
                {selectedCards.map((card, i) => (
                  <div key={card.id} className="text-center">
                    <p className="text-xs text-mystical-400 mb-2">{positions[i]}</p>
                    <TarotCard card={card} isFlipped={true} onClick={() => {}} index={i} />
                    <div className="mt-2 max-w-[140px] mx-auto">
                      <p className="text-xs text-gold font-medium">{card.name}</p>
                      <p className="text-[10px] text-mystical-400 mt-0.5">{card.meaning}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Interpretation */}
              <Card className="max-w-3xl mx-auto" padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <Sparkles size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gold">AI 塔罗解读</h3>
                    <p className="text-xs text-mystical-400">基于塔罗牌的智慧与AI的分析</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedCards.map((card, i) => (
                    <div key={card.id} className="bg-mystical-900/50 rounded-xl p-4 border border-mystical-600/20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{card.image}</span>
                        <span className="font-bold text-white">{card.name}</span>
                        <span className="text-xs text-mystical-400">({positions[i]})</span>
                      </div>
                      <p className="text-sm text-mystical-300 leading-relaxed">
                        {getInterpretation(card, positions[i])}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gold-500/5 border border-gold-500/20 rounded-xl">
                  <p className="text-sm text-mystical-200 leading-relaxed whitespace-pre-line">
                    {getOverallReading()}
                  </p>
                </div>
              </Card>

              <div className="text-center mt-8">
                <Button variant="gold" onClick={handleReset} size="lg">
                  <RotateCcw size={18} className="mr-2" />
                  重新占卜
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Section */}
        <div className="mt-16 mb-8">
          <Card className="max-w-3xl mx-auto" padding="lg">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white mb-2">塔罗牌使用指南</h4>
                <ul className="space-y-2 text-sm text-mystical-300">
                  <li>• <span className="text-gold">单牌占卜</span>：适合日常问题的快速指引</li>
                  <li>• <span className="text-gold">三牌阵</span>：了解过去、现在、未来的脉络</li>
                  <li>• <span className="text-gold">凯尔特十字</span>：最全面的深度解读</li>
                  <li>• 抽牌前请静心冥想，专注于你的问题</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
