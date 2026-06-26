'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tabs from '@/components/ui/Tabs'
import { User, Mail, Lock, Eye, EyeOff, LogOut, Crown, History, Heart, Settings, Sparkles, Star, ChevronRight, Shield, Calendar, Trash2 } from 'lucide-react'

const historyData = [
  { type: '塔罗占卜', date: '2024-01-15', result: '星星（The Star）', icon: '⭐' },
  { type: '星座运势', date: '2024-01-14', result: '天蝎座 · 今日运势', icon: '🦂' },
  { type: '周易占卜', date: '2024-01-13', result: '乾卦 · 大吉', icon: '☯️' },
  { type: '解梦', date: '2024-01-12', result: '飞翔之梦 · 自由', icon: '🌙' },
  { type: '八字命理', date: '2024-01-11', result: '命理分析完成', icon: '📅' },
  { type: '姓名测试', date: '2024-01-10', result: '五行能量 85分', icon: '✨' },
]

const favoritesData = [
  { type: '塔罗牌', name: '星星（The Star）', desc: '希望与灵感的象征', icon: '⭐', date: '2024-01-15' },
  { type: '卦象', name: '乾卦', desc: '天行健，君子以自强不息', icon: '☯️', date: '2024-01-13' },
  { type: '星座配对', name: '天蝎座 × 双鱼座', desc: '天作之合，配对指数 95%', icon: '💕', date: '2024-01-10' },
]

const membershipPlans = [
  { name: '免费版', price: '¥0', period: '永久', features: ['每日1次免费占卜', '基础运势查询', '社区讨论'], current: true },
  { name: '灵境会员', price: '¥29', period: '/月', features: ['无限占卜', '详细AI解读', '专属签文', '优先客服'], current: false, popular: true },
  { name: '至尊会员', price: '¥199', period: '/年', features: ['全部会员权益', '独家课程', '一对一咨询', '生日特权'], current: false },
]

export default function UserPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('history')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const handleLogin = () => {
    if (!email || !password) return
    setIsLoggedIn(true)
  }

  const handleRegister = () => {
    if (!email || !password || !username) return
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setEmail('')
    setPassword('')
    setUsername('')
  }

  const userTabs = [
    { key: 'history', label: '历史记录', icon: <History size={14} /> },
    { key: 'favorites', label: '我的收藏', icon: <Heart size={14} /> },
    { key: 'membership', label: '会员中心', icon: <Crown size={14} /> },
    { key: 'settings', label: '设置', icon: <Settings size={14} /> },
  ]

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              <span className="text-gradient-gold">个人中心</span>
            </h1>
            <p className="text-mystical-300">登录后享受更多神秘学服务</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="max-w-md mx-auto" padding="lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-3">
                  <User size={32} className="text-gold" />
                </div>
                <h2 className="text-xl font-bold text-white">{isRegister ? '创建账号' : '欢迎回来'}</h2>
                <p className="text-sm text-mystical-400 mt-1">
                  {isRegister ? '注册灵境占卜，开启神秘之旅' : '登录灵境占卜，继续探索命运'}
                </p>
              </div>

              <div className="space-y-4">
                {isRegister && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-mystical-200">用户名</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mystical-400" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="请输入用户名"
                        className="w-full bg-mystical-900/50 border border-mystical-600/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-mystical-400 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all duration-200"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-mystical-200">邮箱</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mystical-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="请输入邮箱"
                      className="w-full bg-mystical-900/50 border border-mystical-600/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-mystical-400 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-mystical-200">密码</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mystical-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="请输入密码"
                      className="w-full bg-mystical-900/50 border border-mystical-600/30 rounded-xl pl-10 pr-10 py-3 text-white placeholder-mystical-400 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-mystical-400 hover:text-mystical-200"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={isRegister ? handleRegister : handleLogin}
                  disabled={!email || !password || (isRegister && !username)}
                >
                  {isRegister ? '注册' : '登录'}
                </Button>

                <div className="text-center">
                  <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-sm text-mystical-400 hover:text-gold transition-colors"
                  >
                    {isRegister ? '已有账号？去登录' : '没有账号？立即注册'}
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-mystical-600/20">
                <p className="text-xs text-mystical-500 text-center">
                  登录即表示同意《用户协议》和《隐私政策》
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </Layout>
    )
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
            <span className="text-gradient-gold">个人中心</span>
          </h1>
          <p className="text-mystical-300">管理你的占卜记录与个人信息</p>
        </motion.div>

        {/* User Profile Card */}
        <Card className="mb-6" padding="lg">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
              <span className="text-3xl font-bold text-mystical-900">
                {username ? username[0] : email[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-white">{username || email.split('@')[0]}</h2>
              <p className="text-sm text-mystical-400">{email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="px-2 py-0.5 text-xs bg-gold-500/20 text-gold rounded-full flex items-center gap-1">
                  <Crown size={12} /> 免费版
                </span>
                <span className="text-xs text-mystical-400">注册于 2024年1月</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('membership')}>
                <Crown size={14} className="mr-1" /> 升级会员
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-400 hover:text-red-300">
                <LogOut size={14} className="mr-1" /> 退出
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="text-center p-3 bg-mystical-900/50 rounded-xl border border-mystical-600/20">
              <div className="text-2xl font-bold text-gold">42</div>
              <div className="text-xs text-mystical-400 mt-1">累计占卜</div>
            </div>
            <div className="text-center p-3 bg-mystical-900/50 rounded-xl border border-mystical-600/20">
              <div className="text-2xl font-bold text-gold">3</div>
              <div className="text-xs text-mystical-400 mt-1">连续签到</div>
            </div>
            <div className="text-center p-3 bg-mystical-900/50 rounded-xl border border-mystical-600/20">
              <div className="text-2xl font-bold text-gold">7</div>
              <div className="text-xs text-mystical-400 mt-1">收藏数</div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs tabs={userTabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {activeTab === 'history' && (
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <History size={18} className="text-gold" />
                    历史记录
                  </h3>
                  <span className="text-xs text-mystical-400">共 {historyData.length} 条</span>
                </div>
                <div className="space-y-2">
                  {historyData.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-mystical-900/50 rounded-xl border border-mystical-600/20 hover:border-mystical-500/30 transition-all duration-200 cursor-pointer"
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{item.type}</div>
                        <div className="text-xs text-mystical-400">{item.result}</div>
                      </div>
                      <div className="text-xs text-mystical-500 shrink-0">{item.date}</div>
                      <ChevronRight size={14} className="text-mystical-500 shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'favorites' && (
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Heart size={18} className="text-gold" />
                    我的收藏
                  </h3>
                  <span className="text-xs text-mystical-400">共 {favoritesData.length} 条</span>
                </div>
                <div className="space-y-3">
                  {favoritesData.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-4 bg-mystical-900/50 rounded-xl border border-mystical-600/20"
                    >
                      <div className="text-3xl">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gold mb-0.5">{item.type}</div>
                        <div className="text-sm font-bold text-white truncate">{item.name}</div>
                        <div className="text-xs text-mystical-400 mt-0.5">{item.desc}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-mystical-500">{item.date}</div>
                        <button className="text-xs text-red-400 hover:text-red-300 mt-1 flex items-center gap-1">
                          <Trash2 size={10} /> 删除
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'membership' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {membershipPlans.map((plan, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card
                      className={plan.popular ? 'ring-1 ring-gold-500/50 relative overflow-hidden' : ''}
                      padding="lg"
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-gold-500 text-mystical-900 text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                          推荐
                        </div>
                      )}
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl font-bold text-gold">{plan.price}</span>
                          <span className="text-sm text-mystical-400">{plan.period}</span>
                        </div>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-mystical-300">
                            <Sparkles size={12} className="text-gold shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {plan.current ? (
                        <Button variant="secondary" className="w-full" disabled>
                          当前套餐
                        </Button>
                      ) : (
                        <Button variant={plan.popular ? 'gold' : 'primary'} className="w-full">
                          {plan.popular ? '立即升级' : '选择方案'}
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'settings' && (
              <Card padding="lg">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Settings size={18} className="text-gold" />
                  账号设置
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-mystical-900/50 rounded-xl border border-mystical-600/20">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-mystical-400" />
                      <div>
                        <div className="text-sm font-medium text-white">邮箱</div>
                        <div className="text-xs text-mystical-400">{email}</div>
                      </div>
                    </div>
                    <button className="text-xs text-gold hover:text-gold-400">修改</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-mystical-900/50 rounded-xl border border-mystical-600/20">
                    <div className="flex items-center gap-3">
                      <Lock size={18} className="text-mystical-400" />
                      <div>
                        <div className="text-sm font-medium text-white">密码</div>
                        <div className="text-xs text-mystical-400">已设置</div>
                      </div>
                    </div>
                    <button className="text-xs text-gold hover:text-gold-400">修改</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-mystical-900/50 rounded-xl border border-mystical-600/20">
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-mystical-400" />
                      <div>
                        <div className="text-sm font-medium text-white">通知设置</div>
                        <div className="text-xs text-mystical-400">接收每日运势推送</div>
                      </div>
                    </div>
                    <div className="w-10 h-5 bg-gold-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-mystical-900/50 rounded-xl border border-mystical-600/20">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-mystical-400" />
                      <div>
                        <div className="text-sm font-medium text-white">生日</div>
                        <div className="text-xs text-mystical-400">用于八字分析</div>
                      </div>
                    </div>
                    <button className="text-xs text-gold hover:text-gold-400">设置</button>
                  </div>
                  <div className="pt-4 border-t border-mystical-600/20">
                    <Button variant="danger" className="w-full" onClick={handleLogout}>
                      <LogOut size={16} className="mr-2" />
                      退出登录
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  )
}
