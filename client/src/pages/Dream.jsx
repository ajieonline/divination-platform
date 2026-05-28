import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingSpinner from '../components/LoadingSpinner'

const suggestions = ['水', '火', '蛇', '鱼', '树', '飞', '跌', '门', '花', '月', '考试', '结婚', '钱', '车', '猫', '狗', '天空', '大海', '山', '雨']

export default function Dream() {
  const [keyword, setKeyword] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const interpret = async (kw) => {
    const q = kw || keyword
    if (!q) return
    setLoading(true)
    try {
      const res = await fetch('/api/dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: q })
      })
      const data = await res.json()
      setResult(data)
      setKeyword(q)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-300 to-yellow-300 bg-clip-text text-transparent">
          💤 AI智能解梦
        </h1>
        <p className="text-center text-purple-300/60 mb-8">输入梦境关键词，AI为你解读梦境含义</p>

        {/* Input */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="flex gap-2">
            <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && interpret()}
              placeholder="输入梦境关键词，如：水、蛇、飞、考试..."
              className="input-mystic flex-1" />
            {loading ? (
              <div className="btn-mystic whitespace-nowrap flex items-center gap-2">
                <LoadingSpinner text="" icon="💤" />
              </div>
            ) : (
              <button onClick={() => interpret()} className="btn-mystic whitespace-nowrap">
                💤 解梦
              </button>
            )}
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="max-w-xl mx-auto mb-8">
          <p className="text-sm text-purple-300/60 mb-3">热门关键词：</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button key={s} onClick={() => interpret(s)}
                className="px-3 py-1 rounded-full text-sm card-glass hover:bg-purple-900/30 transition-all text-purple-200/80">
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
              <div className="card-glass p-8">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">🌙</div>
                  <h2 className="text-2xl font-bold text-yellow-300">梦境解读</h2>
                  <div className="text-sm text-purple-300/60 mt-1">关键词：「{result.keyword}」</div>
                </div>

                <div className="p-6 rounded-lg" style={{background: 'rgba(162,28,175,0.1)'}}>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🔮</div>
                    <div>
                      <p className="text-yellow-300 font-bold mb-2">解梦分析</p>
                      <p className="text-purple-200/80 leading-relaxed">{result.fortune || result.interpretation}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg" style={{background: 'rgba(251,191,36,0.1)'}}>
                  <p className="text-yellow-300 font-bold mb-2">💡 温馨提示</p>
                  <p className="text-purple-200/80 text-sm">
                    梦境是潜意识的反映，解梦结果仅供参考。每个人的经历和心理状态不同，同一个梦境可能有不同的含义。
                    如果梦境让你感到困扰，建议与信任的人交流或寻求专业心理咨询。
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
