import React, { useState, useEffect } from 'react'

export default function AdminPayment() {
  const [config, setConfig] = useState({
    wechat_enabled: 'false',
    wechatAppId: '',
    wechatMchId: '',
    wechatApiKey: '',
    wechatNotifyUrl: '',
    alipay_enabled: 'false',
    alipayAppId: '',
    alipayPrivateKey: '',
    alipayPublicKey: '',
    alipayNotifyUrl: '',
    payNotifyHost: 'http://47.86.9.65',
  })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [showKeys, setShowKeys] = useState({})
  const [testResult, setTestResult] = useState(null)

  useEffect(() => { fetchConfig(); fetchStatus() }, [])

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
      })
      const data = await res.json()
      if (data) setConfig(prev => ({ ...prev, ...data }))
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/admin/payment/status', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
      })
      const data = await res.json()
      setStatus(data)
    } catch (err) { console.error(err) }
  }

  const saveConfig = async () => {
    setSaving(true); setMsg('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('adminToken')
        },
        body: JSON.stringify(config)
      })
      if (res.ok) {
        setMsg('✅ 支付配置保存成功')
        fetchStatus()
      } else setMsg('❌ 保存失败')
    } catch (err) { setMsg('❌ 网络错误') }
    setSaving(false)
  }

  const testPayment = async (channel) => {
    setTestResult(null)
    try {
      const res = await fetch('/api/admin/payment/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('adminToken')
        },
        body: JSON.stringify({ channel })
      })
      const data = await res.json()
      setTestResult({ channel, ...data })
    } catch (err) {
      setTestResult({ channel, success: false, error: '网络请求失败' })
    }
  }

  const toggleKey = (field) => {
    setShowKeys(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const update = (key, value) => setConfig(prev => ({ ...prev, [key]: value }))

  const Section = ({ title, icon, children, enabled, onToggle }) => (
    <div className={`bg-gray-800/50 backdrop-blur rounded-xl border p-6 mb-6 transition-all ${enabled ? 'border-green-500/30' : 'border-gray-700'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>{icon}</span>{title}
        </h3>
        {onToggle !== undefined && (
          <button onClick={onToggle}
            className={`relative w-14 h-7 rounded-full transition-all ${enabled ? 'bg-green-600' : 'bg-gray-600'}`}>
            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${enabled ? 'left-7.5 translate-x-0' : 'left-0.5'}`}
              style={{ left: enabled ? '30px' : '2px' }} />
          </button>
        )}
      </div>
      {children}
    </div>
  )

  const Field = ({ label, field, type = 'text', placeholder = '', secret = false }) => (
    <div className="mb-4">
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <input
          type={secret && !showKeys[field] ? 'password' : type}
          value={config[field] || ''}
          placeholder={placeholder}
          onChange={e => update(field, e.target.value)}
          className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 pr-10" />
        {secret && (
          <button onClick={() => toggleKey(field)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm">
            {showKeys[field] ? '🙈' : '👁️'}
          </button>
        )}
      </div>
    </div>
  )

  if (loading) return <div className="text-center py-12 text-gray-400">加载中...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">💳 支付配置</h2>
        <button onClick={saveConfig} disabled={saving}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition">
          {saving ? '保存中...' : '💾 保存配置'}
        </button>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {msg}
        </div>
      )}

      {/* 支付状态概览 */}
      {status && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-xl border ${status.wechat?.configured ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-800/50 border-gray-700'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">💚 微信支付</p>
                <p className="text-sm text-gray-400 mt-1">
                  {status.wechat?.enabled ? '✅ 已启用' : '⏸️ 未启用'}
                  {status.wechat?.configured ? ' · 配置完整' : ' · ⚠️ 配置不完整'}
                </p>
                {status.wechat?.appId && <p className="text-xs text-gray-500 mt-1">AppID: {status.wechat.appId}</p>}
              </div>
              <button onClick={() => testPayment('wechat')}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition">
                🧪 测试
              </button>
            </div>
          </div>
          <div className={`p-4 rounded-xl border ${status.alipay?.configured ? 'bg-blue-500/10 border-blue-500/30' : 'bg-gray-800/50 border-gray-700'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">🔵 支付宝</p>
                <p className="text-sm text-gray-400 mt-1">
                  {status.alipay?.enabled ? '✅ 已启用' : '⏸️ 未启用'}
                  {status.alipay?.configured ? ' · 配置完整' : ' · ⚠️ 配置不完整'}
                </p>
                {status.alipay?.appId && <p className="text-xs text-gray-500 mt-1">AppID: {status.alipay.appId}</p>}
              </div>
              <button onClick={() => testPayment('alipay')}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition">
                🧪 测试
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 测试结果 */}
      {testResult && (
        <div className={`mb-4 p-4 rounded-lg text-sm ${testResult.success ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
          <p className="font-semibold">{testResult.channel === 'wechat' ? '💚 微信支付' : '🔵 支付宝'} 测试结果</p>
          <p className="mt-1">{testResult.success ? '✅ 连接成功，配置正确' : `⚠️ ${testResult.error || '连接失败，请检查配置'}`}</p>
        </div>
      )}

      {/* 回调地址 */}
      <Section title="回调地址配置" icon="🔗" enabled={true}>
        <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-300 mb-2">支付回调地址（支付成功后微信/支付宝会主动通知此地址）</p>
          <Field label="服务器公网地址" field="payNotifyHost" placeholder="http://47.86.9.65" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm text-gray-400 mb-1">微信回调地址（自动生成）</label>
              <div className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 text-sm font-mono">
                {config.payNotifyHost || 'http://47.86.9.65'}/api/pay/callback/wechat
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">支付宝回调地址（自动生成）</label>
              <div className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 text-sm font-mono">
                {config.payNotifyHost || 'http://47.86.9.65'}/api/pay/callback/alipay
              </div>
            </div>
          </div>
          <p className="text-xs text-yellow-400/70 mt-3">
            ⚠️ 请将以上回调地址分别配置到微信支付商户平台和支付宝开放平台的"支付回调"设置中
          </p>
        </div>
      </Section>

      {/* 微信支付 */}
      <Section title="微信支付配置" icon="💚"
        enabled={config.wechat_enabled === 'true'}
        onToggle={() => update('wechat_enabled', config.wechat_enabled === 'true' ? 'false' : 'true')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="AppID" field="wechatAppId" placeholder="wx1234567890abcdef" />
          <Field label="商户号 MchID" field="wechatMchId" placeholder="1234567890" />
          <Field label="API密钥" field="wechatApiKey" placeholder="32位密钥" secret />
          <Field label="回调地址（可自定义覆盖）" field="wechatNotifyUrl" placeholder="留空使用默认" />
        </div>
        <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
          <p className="text-sm text-gray-300 font-semibold mb-2">📋 接入指南</p>
          <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
            <li>登录 <a href="https://pay.weixin.qq.com" target="_blank" className="text-purple-400 hover:underline">微信支付商户平台</a></li>
            <li>进入「产品中心」→「Native支付」，开通此功能</li>
            <li>在「账户中心」→「API安全」中获取API密钥（需设置MD5密钥）</li>
            <li>在「产品中心」→「开发配置」中设置支付回调URL</li>
            <li>将AppID、商户号、API密钥填入上方表单</li>
          </ol>
          <p className="text-xs text-yellow-400/70 mt-3">
            💡 测试阶段可使用微信支付沙箱环境，正式上线需签约商户号
          </p>
        </div>
      </Section>

      {/* 支付宝 */}
      <Section title="支付宝配置" icon="🔵"
        enabled={config.alipay_enabled === 'true'}
        onToggle={() => update('alipay_enabled', config.alipay_enabled === 'true' ? 'false' : 'true')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="AppID" field="alipayAppId" placeholder="2021001234567890" />
          <Field label="回调地址（可自定义覆盖）" field="alipayNotifyUrl" placeholder="留空使用默认" />
        </div>
        <Field label="应用私钥" field="alipayPrivateKey" placeholder="MIIEvQIBADANBgkqhki..." secret />
        <Field label="支付宝公钥" field="alipayPublicKey" placeholder="MIIBIjANBgkqhkiG9w0B..." secret />
        <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
          <p className="text-sm text-gray-300 font-semibold mb-2">📋 接入指南</p>
          <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
            <li>登录 <a href="https://open.alipay.com" target="_blank" className="text-blue-400 hover:underline">支付宝开放平台</a></li>
            <li>创建应用 → 选择「电脑网站支付」</li>
            <li>在「接口加签方式」中获取应用私钥和支付宝公钥</li>
            <li>在「应用网关」和「授权回调地址」中配置回调URL</li>
            <li>提交审核并等待支付宝审批通过</li>
          </ol>
          <p className="text-xs text-yellow-400/70 mt-3">
            💡 沙箱环境可在开放平台控制台切换，测试账号无需真实签约
          </p>
        </div>
      </Section>

      {/* 订单超时设置 */}
      <Section title="订单管理" icon="⏰" enabled={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">未支付订单自动关闭（分钟）</label>
            <input type="number" value={config.orderTimeout || '30'}
              onChange={e => update('orderTimeout', e.target.value)}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">支付方式选择</label>
            <div className="flex gap-3 mt-2">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input type="checkbox" checked={config.wechat_enabled === 'true'}
                  onChange={() => update('wechat_enabled', config.wechat_enabled === 'true' ? 'false' : 'true')}
                  className="rounded" />
                💚 微信支付
              </label>
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input type="checkbox" checked={config.alipay_enabled === 'true'}
                  onChange={() => update('alipay_enabled', config.alipay_enabled === 'true' ? 'false' : 'true')}
                  className="rounded" />
                🔵 支付宝
              </label>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
