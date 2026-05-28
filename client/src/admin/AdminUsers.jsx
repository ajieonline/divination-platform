import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20
  
  useEffect(() => {
    fetchUsers()
  }, [page])
  
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=${limit}&search=${search}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
      })
      const data = await res.json()
      setUsers(data.users || [])
      setTotal(data.total || 0)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }
  
  const deleteUser = async (id) => {
    if (!confirm('确定删除该用户？')) return
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
      })
      fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }
  
  const updateVip = async (id, isVip) => {
    try {
      await fetch(`/api/admin/users/${id}/vip`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('adminToken') 
        },
        body: JSON.stringify({ isVip: !isVip })
      })
      fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">👥 用户管理</h2>
        <div className="flex gap-2">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchUsers()}
            placeholder="搜索用户名..."
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500" />
          <button onClick={fetchUsers} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">搜索</button>
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">用户名</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">昵称</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">VIP状态</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">注册时间</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">加载中...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">暂无用户</td></tr>
            ) : users.map(user => (
              <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                <td className="px-6 py-4 text-white">{user.username}</td>
                <td className="px-6 py-4 text-gray-300">{user.nickname || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.is_vip ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-600/30 text-gray-400'}`}>
                    {user.is_vip ? 'VIP会员' : '普通用户'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">{new Date(user.created_at).toLocaleDateString('zh-CN')}</td>
                <td className="px-6 py-4">
                  <button onClick={() => updateVip(user.id, user.is_vip)}
                    className={`mr-2 px-3 py-1 rounded text-xs ${user.is_vip ? 'bg-gray-600 text-gray-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                    {user.is_vip ? '取消VIP' : '设为VIP'}
                  </button>
                  <button onClick={() => deleteUser(user.id)}
                    className="px-3 py-1 rounded text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {total > limit && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50">上一页</button>
          <span className="px-4 py-2 text-gray-400">第 {page} 页 / 共 {Math.ceil(total / limit)} 页</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page * limit >= total}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50">下一页</button>
        </div>
      )}
    </div>
  )
}
