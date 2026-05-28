import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchStats()
  }, [])
  
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
      })
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }
  
  if (loading) return <div className="text-center py-12 text-gray-400">加载中...</div>
  
  const statCards = [
    { label: '总用户数', value: stats?.totalUsers || 0, icon: '👥', color: 'from-blue-500 to-cyan-500' },
    { label: '今日新增用户', value: stats?.todayUsers || 0, icon: '📈', color: 'from-green-500 to-emerald-500' },
    { label: '总占卜次数', value: stats?.totalRecords || 0, icon: '🔮', color: 'from-purple-500 to-pink-500' },
    { label: '今日占卜次数', value: stats?.todayRecords || 0, icon: '📊', color: 'from-orange-500 to-red-500' },
    { label: '总收入(元)', value: stats?.totalRevenue || 0, icon: '💰', color: 'from-yellow-500 to-orange-500' },
    { label: '今日收入(元)', value: stats?.todayRevenue || 0, icon: '💵', color: 'from-pink-500 to-rose-500' }
  ]
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">📊 数据概览</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{card.label}</p>
                <p className="text-3xl font-bold text-white mt-2">{card.value.toLocaleString()}</p>
              </div>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl`}>
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Records */}
        <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">📋 最近占卜记录</h3>
          <div className="space-y-3">
            {stats?.recentRecords?.map((record, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{record.type === 'tarot' ? '🃏' : record.type === 'zodiac' ? '⭐' : '🔮'}</span>
                  <div>
                    <p className="text-white text-sm">{record.type === 'tarot' ? '塔罗牌' : record.type}</p>
                    <p className="text-gray-400 text-xs">{record.username || '匿名用户'}</p>
                  </div>
                </div>
                <span className="text-gray-500 text-xs">{new Date(record.created_at).toLocaleString('zh-CN')}</span>
              </div>
            ))}
            {(!stats?.recentRecords || stats.recentRecords.length === 0) && (
              <p className="text-gray-500 text-center py-4">暂无记录</p>
            )}
          </div>
        </div>
        
        {/* Type Distribution */}
        <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">📈 占卜类型分布</h3>
          <div className="space-y-4">
            {stats?.typeStats?.map((stat, i) => {
              const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-pink-500']
              const labels = { tarot: '🃏 塔罗牌', zodiac: '⭐ 星座运势', 'eight-characters': '☯️ 八字命理', iching: '📖 易经六爻', name: '✍️ 姓名测试' }
              return (
                <div key={stat.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{labels[stat.type] || stat.type}</span>
                    <span className="text-gray-400">{stat.count}次</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className={`${colors[i % colors.length]} h-2 rounded-full transition-all`}
                      style={{width: `${(stat.count / (stats?.totalRecords || 1)) * 100}%`}}></div>
                  </div>
                </div>
              )
            })}
            {(!stats?.typeStats || stats.typeStats.length === 0) && (
              <p className="text-gray-500 text-center py-4">暂无数据</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
