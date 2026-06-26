import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token)
        navigate('/admin')
      } else {
        setError(data.error || '登录失败')
      }
    } catch (err) {
      setError('网络错误')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔮</div>
          <h1 className="text-3xl font-bold text-white">管理后台</h1>
          <p className="text-gray-400 mt-2">神秘占卜馆管理系统</p>
        </div>
        
        <form onSubmit={handleLogin} className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-purple-500/20">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">用户名</label>
            <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition"
              placeholder="请输入管理员账号" required />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">密码</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition"
              placeholder="请输入密码" required />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50">
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
