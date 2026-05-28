import React, { useState, useEffect } from 'react'
import Dropdown from '../components/Dropdown'

export default function AdminRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20
  
  const typeLabels = { tarot: '🃏 塔罗牌', zodiac: '⭐ 星座运势', 'eight-characters': '☯️ 八字命理', iching: '📖 易经六爻', name: '✍️ 姓名测试', sign: '🎋 抽签问卦' }
  
  useEffect(() => {
    fetchRecords()
  }, [page, typeFilter])
  
  const fetchRecords = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/records?page=${page}&limit=${limit}&type=${typeFilter}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
      })
      const data = await res.json()
      setRecords(data.records || [])
      setTotal(data.total || 0)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }
  
  const deleteRecord = async (id) => {
    if (!confirm('确定删除该记录？')) return
    try {
      await fetch(`/api/admin/records/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
      })
      fetchRecords()
    } catch (err) {
      console.error(err)
    }
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">📋 占卜记录</h2>
        <div className="flex gap-2" style={{minWidth: 200}}>
          <Dropdown value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1) }}
            theme="dark" placeholder="全部类型"
            options={[
              { value: '', label: '全部类型', icon: '📋' },
              ...Object.entries(typeLabels).map(([key, label]) => ({ value: key, label }))
            ]} />
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">类型</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">用户</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">问题</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">时间</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">加载中...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">暂无记录</td></tr>
            ) : records.map(record => (
              <tr key={record.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                <td className="px-6 py-4 text-white">{typeLabels[record.type] || record.type}</td>
                <td className="px-6 py-4 text-gray-300">{record.username || '匿名'}</td>
                <td className="px-6 py-4 text-gray-400 text-sm max-w-xs truncate">{record.question || '-'}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{new Date(record.created_at).toLocaleString('zh-CN')}</td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteRecord(record.id)}
                    className="px-3 py-1 rounded text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
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
