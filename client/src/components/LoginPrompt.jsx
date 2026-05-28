import React, { useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthContext } from '../App'

export default function LoginPrompt({ show, onClose, message }) {
  const { login } = useContext(AuthContext)
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ username: '', password: '', nickname: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!show) return null

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        login(data.user, data.token)
        onClose()
      } else {
        setError(data.error || '操作失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    }
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm rounded-2xl border border-purple-500/30 p-6 relative"
            style={{ background: 'linear-gradient(135deg, #1a0a2e, #0d0618)' }}
            onClick={e => e.stopPropagation()}>
            
            {/* Close button */}
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
            
            {/* Icon */}
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">🔐</div>
              <h3 className="text-xl font-bold text-white">{message || '登录后即可使用'}</h3>
              <p className="text-sm text-purple-300/60 mt-1">
                {isLogin ? '欢迎回来，登录后享受完整体验' : '注册即享免费占卜次数'}
              </p>
            </div>

            {/* Tab toggle */}
            <div className="flex mb-5 bg-purple-900/30 rounded-lg p-1">
              <button onClick={() => { setIsLogin(true); setError('') }}
                className={`flex-1 py-2 rounded-md transition-all text-sm font-medium ${isLogin ? 'bg-purple-600 text-white shadow-lg' : 'text-purple-300 hover:text-white'}`}>
                登录
              </button>
              <button onClick={() => { setIsLogin(false); setError('') }}
                className={`flex-1 py-2 rounded-md transition-all text-sm font-medium ${!isLogin ? 'bg-purple-600 text-white shadow-lg' : 'text-purple-300 hover:text-white'}`}>
                注册
              </button>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <input type="text" placeholder="用户名" value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-purple-900/30 border border-purple-500/20 text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 transition text-sm" />
              <input type="password" placeholder="密码" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                onKeyDown={e => e.key === 'Enter' && submit()}
                className="w-full px-4 py-3 rounded-xl bg-purple-900/30 border border-purple-500/20 text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 transition text-sm" />
              {!isLogin && (
                <input type="text" placeholder="昵称（可选）" value={form.nickname}
                  onChange={e => setForm({...form, nickname: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-purple-900/30 border border-purple-500/20 text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 transition text-sm" />
              )}
            </div>

            {error && <p className="text-red-400 text-xs mt-3 text-center">{error}</p>}

            <button onClick={submit} disabled={loading || !form.username || !form.password}
              className="w-full mt-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20">
              {loading ? '处理中...' : isLogin ? '✨ 登录' : '🎉 注册'}
            </button>

            {/* Benefits */}
            {!isLogin && (
              <div className="mt-4 p-3 rounded-lg bg-yellow-400/5 border border-yellow-400/20">
                <p className="text-xs text-yellow-300/80 text-center">🎁 注册即享：首次免费占卜 + 50积分</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
