import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { authHeaders, readApiJson } from '../utils/api'

const defaultProduct = { product: 'single_report', name: '单次综合测试报告', amount: 5 }

export default function PaywallNotice({ payload, user, token, className = '' }) {
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [message, setMessage] = useState('')

  if (!payload?.paymentRequired) return null

  const product = payload.product || defaultProduct
  const quota = payload.quota || {}
  const isGuest = quota.subjectType === 'visitor' || !user

  const buySingleReport = async () => {
    if (!user || !token) {
      setMessage('请先登录账号，再购买单次综合测试报告。')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      const data = await fetch('/api/pay/create', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ product: product.product || 'single_report', payChannel: 'wechat' }),
      }).then(readApiJson)
      setOrder(data)
    } catch (err) {
      setMessage(err.message || '订单创建失败，请稍后重试')
    }
    setLoading(false)
  }

  return (
    <div className={`card-glass rounded-xl border border-amber-300/30 bg-amber-300/10 p-5 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/70">Usage limit</div>
          <h3 className="mt-2 text-xl font-bold text-yellow-300">免费测算次数已用完</h3>
          <p className="mt-2 text-sm leading-relaxed text-purple-100/78">
            {payload.error || '当前账号的免费测算次数已用完，可以购买单次报告或开通会员继续使用。'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-purple-100/70">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">游客免费 1 次</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">普通用户免费 3 次</span>
            <span className="rounded-full border border-yellow-300/25 bg-yellow-300/10 px-3 py-1 text-yellow-100">会员不限次免费</span>
          </div>
          {Number.isFinite(quota.limit) && (
            <p className="mt-3 text-xs text-purple-200/55">
              当前已用 {quota.used || quota.limit} / {quota.limit} 次
              {quota.paidCreditsRemaining ? `，剩余付费额度 ${quota.paidCreditsRemaining} 次` : ''}
            </p>
          )}
        </div>

        <div className="min-w-[180px] rounded-lg border border-yellow-300/20 bg-black/18 p-4 text-center">
          <div className="text-xs text-purple-200/55">{product.name}</div>
          <div className="mt-1 text-3xl font-bold text-yellow-300">¥{product.amount}</div>
          <div className="mt-1 text-xs text-purple-200/55">购买后解锁 1 次完整测试</div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {isGuest ? (
          <Link to="/profile" className="btn-gold text-center text-sm">登录后继续</Link>
        ) : (
          <button onClick={buySingleReport} disabled={loading} className="btn-gold text-sm disabled:opacity-50">
            {loading ? '正在创建订单...' : `购买单次报告 ¥${product.amount}`}
          </button>
        )}
        <Link to="/vip" className="btn-mystic text-center text-sm">开通会员不限次</Link>
      </div>

      {message && <div className="mt-4 rounded-lg border border-yellow-300/20 bg-yellow-300/10 p-3 text-sm text-yellow-100">{message}</div>}

      {order && (
        <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-4 text-center">
          <h4 className="font-bold text-yellow-300">订单已创建</h4>
          <p className="mt-1 text-xs text-purple-200/60">订单号：{order.orderNo}</p>
          {order.qrCode && <img src={order.qrCode} alt="支付二维码" className="mx-auto mt-3 rounded-lg border border-white/10" />}
          {order.codeUrl && !order.qrCode && <p className="mt-3 break-all text-xs text-purple-200/55">{order.codeUrl}</p>}
          {order.payUrl && <a className="btn-gold mt-3 inline-block text-sm" href={order.payUrl}>打开支付页面</a>}
          {order.message && <p className="mt-3 text-xs text-purple-200/55">{order.message}</p>}
          <Link to="/orders" className="mt-3 inline-block text-sm text-yellow-200 underline">查看订单中心</Link>
        </div>
      )}
    </div>
  )
}
