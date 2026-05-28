import React, { useState, useEffect } from 'react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: '神秘占卜馆',
    siteDesc: '专业在线占卜平台',
    adminPassword: '',
    wechatAppId: '',
    wechatMchId: '',
    wechatApiKey: '',
    alipayAppId: '',
    alipayPrivateKey: '',
    alipayPublicKey: '',
    tarotPrice: 5.9,
    tarotThreePrice: 9.9,
    tarotCelticPrice: 19.9,
    ichingPrice: 5.9,
    nameMatchPrice: 3.9,
    dreamPrice: 2.9,
    vipMonthPrice: 29.9,
    vipYearPrice: 199
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
      })
      const data = await res.json()
      if (data) setSettings(prev => ({ ...prev, ...data }))
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const saveSettings = async () => {
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('adminToken')
        },
        body: JSON.stringify(settings)
      })
      if (res.ok) setMsg('✅ 保存成功')
      else setMsg('❌ 保存失败')
    } catch (err) {
      setMsg('❌ 网络错误')
    }
    setSaving(false)
  }

  const Section = ({ title, icon, children }) => (
    <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span>{icon}</span>{title}
      </h3>
      {children}
    </div>
  )

  const Field = ({ label, field, type = 'text', placeholder = '' }) => (
    <div className="mb-4">
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input type={type} value={settings[field] || ''} placeholder={placeholder}
        onChange={e => setSettings({ ...settings, [field]: e.target.value })}
        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500" />
    </div>
  )

  if (loading) return <div className="text-center py-12 text-gray-400">加载中...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">⚙️ 系统设置</h2>
        <button onClick={saveSettings} disabled={saving}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
          {saving ? '保存中...' : '💾 保存设置'}
        </button>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {msg}
        </div>
      )}

      <Section title="网站基本信息" icon="🌐">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="网站名称" field="siteName" placeholder="神秘占卜馆" />
          <Field label="网站描述" field="siteDesc" placeholder="专业在线占卜平台" />
        </div>
      </Section>

      <Section title="管理员账号" icon="🔐">
        <Field label="修改管理员密码（留空不修改）" field="adminPassword" type="password" placeholder="输入新密码" />
      </Section>

      <Section title="微信支付配置" icon="💚">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="AppID" field="wechatAppId" placeholder="wx1234567890" />
          <Field label="商户号 MchID" field="wechatMchId" placeholder="1234567890" />
          <Field label="API密钥" field="wechatApiKey" placeholder="32位密钥" />
        </div>
        <p className="text-xs text-gray-500 mt-2">在微信支付商户平台获取：https://pay.weixin.qq.com</p>
      </Section>

      <Section title="支付宝配置" icon="🔵">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="AppID" field="alipayAppId" placeholder="2021001234567890" />
          <Field label="应用私钥" field="alipayPrivateKey" placeholder="MIIEvQ..." />
          <Field label="支付宝公钥" field="alipayPublicKey" placeholder="MIIBIjAN..." />
        </div>
        <p className="text-xs text-gray-500 mt-2">在支付宝开放平台获取：https://open.alipay.com</p>
      </Section>

      <Section title="占卜定价（元/次）" icon="💰">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="塔罗牌单次" field="tarotPrice" type="number" />
          <Field label="三牌阵" field="tarotThreePrice" type="number" />
          <Field label="凯尔特十字" field="tarotCelticPrice" type="number" />
          <Field label="易经六爻" field="ichingPrice" type="number" />
          <Field label="姓名配对" field="nameMatchPrice" type="number" />
          <Field label="AI解梦" field="dreamPrice" type="number" />
        </div>
      </Section>

      <Section title="VIP会员定价（元）" icon="👑">
        <div className="grid grid-cols-2 gap-4">
          <Field label="月卡价格" field="vipMonthPrice" type="number" />
          <Field label="年卡价格" field="vipYearPrice" type="number" />
        </div>
        <p className="text-xs text-gray-500 mt-2">VIP会员享受所有占卜功能无限次使用</p>
      </Section>
    </div>
  )
}
