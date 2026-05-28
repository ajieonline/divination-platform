import React, { useEffect } from 'react'
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const menuItems = [
  { path: '/admin', label: '数据概览', icon: '📊' },
  { path: '/admin/users', label: '用户管理', icon: '👥' },
  { path: '/admin/records', label: '占卜记录', icon: '📋' },
  { path: '/admin/orders', label: '订单管理', icon: '💰' },
  { path: '/admin/payment', label: '支付配置', icon: '💳' },
  { path: '/admin/settings', label: '系统设置', icon: '⚙️' }
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('adminToken')
  
  useEffect(() => {
    if (!token) navigate('/admin/login')
  }, [token, navigate])
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }
  
  if (!token) return null
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-gray-800 border-r border-gray-700 z-50">
        <div className="p-6 border-b border-gray-700">
          <Link to="/admin" className="flex items-center gap-3">
            <span className="text-3xl">🔮</span>
            <div>
              <h1 className="text-lg font-bold text-white">管理后台</h1>
              <p className="text-xs text-gray-400">神秘占卜馆</p>
            </div>
          </Link>
        </div>
        
        <nav className="p-4">
          {menuItems.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                location.pathname === item.path 
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30' 
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
              }`}>
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/20 hover:text-red-300 transition">
            <span className="text-xl">🚪</span>
            <span>退出登录</span>
          </button>
          <Link to="/" className="mt-2 w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition">
            <span className="text-xl">🏠</span>
            <span>返回前台</span>
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="ml-64 p-8">
        <Outlet />
      </div>
    </div>
  )
}
