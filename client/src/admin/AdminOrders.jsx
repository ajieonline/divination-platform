import React, { useState, useEffect } from 'react'
import Dropdown from '../components/Dropdown'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  useEffect(() => { fetchOrders() }, [page, statusFilter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders?page=${page}&limit=${limit}&status=${statusFilter}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
      })
      const data = await res.json()
      setOrders(data.orders || [])
      setTotal(data.total || 0)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const refundOrder = async (id) => {
    if (!confirm('确定退款？')) return
    try {
      await fetch(`/api/admin/orders/${id}/refund`, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
      })
      fetchOrders()
    } catch (err) { console.error(err) }
  }

  const statusMap = {
    pending: { label: '待支付', color: 'bg-yellow-500/20 text-yellow-300' },
    paid: { label: '已支付', color: 'bg-green-500/20 text-green-300' },
    refunded: { label: '已退款', color: 'bg-red-500/20 text-red-300' },
    expired: { label: '已过期', color: 'bg-gray-500/20 text-gray-400' }
  }

  const productMap = {
    vip_month: 'VIP月卡(¥29.9)',
    vip_year: 'VIP年卡(¥199)',
    tarot_single: '塔罗牌单次(¥5.9)',
    tarot_three: '三牌阵(¥9.9)',
    tarot_celtic: '凯尔特十字(¥19.9)',
    iching_single: '易经单次(¥5.9)',
    name_match: '姓名配对(¥3.9)',
    dream_single: '解梦单次(¥2.9)'
  }

  const payChannelMap = { wechat: '微信支付', alipay: '支付宝' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">💰 订单管理</h2>
        <div style={{minWidth: 180}}>
          <Dropdown value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1) }}
            theme="dark" placeholder="全部状态"
            options={[
              { value: '', label: '全部状态', icon: '📋' },
              { value: 'pending', label: '待支付', icon: '⏳' },
              { value: 'paid', label: '已支付', icon: '✅' },
              { value: 'refunded', label: '已退款', icon: '🔄' },
              { value: 'expired', label: '已过期', icon: '⏰' }
            ]} />
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">订单号</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">用户</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">商品</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">金额</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">支付方式</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">状态</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">时间</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="px-6 py-8 text-center text-gray-400">加载中...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="8" className="px-6 py-8 text-center text-gray-400">暂无订单</td></tr>
            ) : orders.map(order => (
              <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                <td className="px-4 py-3 text-gray-300 text-xs font-mono">{order.order_no?.slice(0, 16)}...</td>
                <td className="px-4 py-3 text-white text-sm">{order.username || '匿名'}</td>
                <td className="px-4 py-3 text-gray-300 text-sm">{productMap[order.product] || order.product}</td>
                <td className="px-4 py-3 text-yellow-300 font-semibold">¥{order.amount}</td>
                <td className="px-4 py-3 text-gray-300 text-sm">{payChannelMap[order.pay_channel] || order.pay_channel || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusMap[order.status]?.color || ''}`}>
                    {statusMap[order.status]?.label || order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(order.created_at).toLocaleString('zh-CN')}</td>
                <td className="px-4 py-3">
                  {order.status === 'paid' && (
                    <button onClick={() => refundOrder(order.id)}
                      className="px-3 py-1 rounded text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30">退款</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > limit && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50">上一页</button>
          <span className="px-4 py-2 text-gray-400">第 {page} 页 / 共 {Math.ceil(total / limit)} 页</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page * limit >= total}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50">下一页</button>
        </div>
      )}
    </div>
  )
}
