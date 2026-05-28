import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const api = async (path, opts = {}) => {
  const token = localStorage.getItem('admin_token')
  const res = await fetch(`/api/admin${path}`, { ...opts, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...opts.headers } })
  return res.json()
}

function Login({ onLogin }) {
  const { t } = useTranslation('admin')
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const submit = async () => {
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.token) { localStorage.setItem('admin_token', data.token); onLogin(data.admin) }
    else setError(data.error || t('loginFailed'))
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #0f0524 0%, #1a0a3e 50%, #0d0318 100%)'}}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card-glass p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-yellow-300">{t('loginTitle')}</h2>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">{error}</div>}
        <input className="input-mystic w-full mb-3" placeholder={t('username')} value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
        <input className="input-mystic w-full mb-4" type="password" placeholder={t('password')} value={form.password} onChange={e => setForm({...form, password: e.target.value})} onKeyDown={e => e.key==='Enter' && submit()} />
        <button onClick={submit} className="btn-gold w-full">{t('loginBtn')}</button>
      </motion.div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, color = '#fbbf24' }) {
  return (
    <div className="card-glass p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{background: `${color}15`}}>{icon}</div>
      <div>
        <div className="text-2xl font-bold" style={{color}}>{value}</div>
        <div className="text-sm text-purple-300/60">{label}</div>
        {sub && <div className="text-xs text-purple-300/40">{sub}</div>}
      </div>
    </div>
  )
}

function Dashboard({ stats }) {
  const { t, i18n } = useTranslation('admin')
  const tc = useTranslation('admin').t
  const lang = i18n.language?.startsWith('en') ? 'en' : 'zh'
  const tn = t('typeNames', { returnObjects: true })
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="👥" label={t('dashboard.totalUsers')} value={stats.totalUsers} sub={`${t('dashboard.todayUsers')} +${stats.todayUsers}`} color="#a78bfa" />
        <StatCard icon="🔮" label={t('dashboard.totalRecords')} value={stats.totalRecords} sub={`${t('dashboard.todayRecords')} +${stats.todayRecords}`} color="#f472b6" />
        <StatCard icon="💰" label={t('dashboard.totalRevenue')} value={`¥${stats.totalRevenue}`} sub={`${t('dashboard.todayRevenue')} +¥${stats.todayRevenue}`} color="#fbbf24" />
        <StatCard icon="👑" label={t('dashboard.vipUsers')} value={stats.vipUsers} sub={`${t('dashboard.payRate')} ${stats.totalUsers ? Math.round(stats.vipUsers/stats.totalUsers*100) : 0}%`} color="#c084fc" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-glass p-6">
          <h3 className="text-yellow-300 font-bold mb-4">{t('dashboard.typeStats')}</h3>
          {(stats.typeStats || []).map(s => (
            <div key={s.type} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-purple-200/80">{tn[s.type] || s.type}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 rounded-full bg-purple-900/50 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style={{width: `${Math.min(100, s.count / Math.max(...(stats.typeStats||[]).map(x=>x.count||1)) * 100)}%`}} />
                </div>
                <span className="text-sm text-purple-300/60 w-8 text-right">{s.count}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="card-glass p-6">
          <h3 className="text-yellow-300 font-bold mb-4">{t('dashboard.recentRecords')}</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(stats.recentRecords || []).map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 text-sm">
                <div className="flex items-center gap-2">
                  <span>{tn[r.type] || r.type}</span>
                  <span className="text-purple-300/40">|</span>
                  <span className="text-purple-200/60 truncate max-w-[120px]">{r.username || t('dashboard.anonymous')}</span>
                </div>
                <span className="text-purple-300/40 text-xs">{new Date(r.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TrafficStats({ stats }) {
  const { t } = useTranslation('admin')
  const daily = stats.dailyTraffic || []
  const maxDaily = Math.max(...daily.map(d => d.requests), 1)
  const topEndpoints = stats.topEndpoints || []
  const hourly = stats.hourlyTraffic || []
  const maxHourly = Math.max(...hourly.map(h => h.count), 1)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="📡" label={t('traffic.totalRequests')} value={stats.totalRecords} color="#60a5fa" />
        <StatCard icon="🔍" label={t('traffic.aiStatus')} value={stats.aiEnabled ? t('traffic.aiEnabled') : t('traffic.aiDisabled')} sub={stats.aiModel || ''} color={stats.aiEnabled ? '#4ade80' : '#f87171'} />
        <StatCard icon="💰" label={t('traffic.totalOrders')} value={stats.totalOrders} sub={`${t('traffic.paidOrders')} ${stats.paidOrders}`} color="#fbbf24" />
        <StatCard icon="📈" label={t('traffic.dailyIp')} value={daily.length > 0 ? daily[daily.length-1]?.unique_ips || 0 : 0} sub={t('traffic.today')} color="#a78bfa" />
      </div>
      <div className="card-glass p-6">
        <h3 className="text-yellow-300 font-bold mb-4">{t('traffic.trend7d')}</h3>
        <div className="flex items-end gap-2 h-40">
          {daily.length > 0 ? daily.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs text-purple-300/60">{d.requests}</div>
              <div className="w-full rounded-t-lg transition-all" style={{height: `${(d.requests / maxDaily) * 100}%`, background: 'linear-gradient(180deg, #a21caf, #7c3aed)', minHeight: 4}} />
              <div className="text-xs text-purple-300/40">{(d.day || '').slice(5)}</div>
            </div>
          )) : <div className="flex-1 text-center text-purple-300/40">{t('traffic.noData')}</div>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-glass p-6">
          <h3 className="text-yellow-300 font-bold mb-4">{t('traffic.hourlyToday')}</h3>
          <div className="flex items-end gap-1 h-32">
            {Array.from({length: 24}, (_, i) => {
              const h = hourly.find(x => parseInt(x.hour) === i)
              const count = h?.count || 0
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black/80 text-xs text-white px-2 py-1 rounded">{i}:00 — {count}</div>
                  <div className="w-full rounded-t" style={{height: `${count ? Math.max(4, (count / maxHourly) * 100) : 2}%`, background: count ? 'linear-gradient(180deg, #f472b6, #a21caf)' : 'rgba(255,255,255,0.05)'}} />
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-1"><span className="text-xs text-purple-300/30">0:00</span><span className="text-xs text-purple-300/30">12:00</span><span className="text-xs text-purple-300/30">23:00</span></div>
        </div>
        <div className="card-glass p-6">
          <h3 className="text-yellow-300 font-bold mb-4">{t('traffic.hotApis')}</h3>
          <div className="space-y-2">
            {topEndpoints.map((ep, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'][i] || '•'}</span>
                  <code className="text-sm text-purple-200/80 font-mono">{ep.path}</code>
                </div>
                <span className="text-sm text-yellow-300">{ep.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AIConfig() {
  const { t } = useTranslation('admin')
  const [settings, setSettings] = useState({})
  const [testResult, setTestResult] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { api('/settings').then(setSettings) }, [])
  const update = (key, val) => setSettings({ ...settings, [key]: val })
  const save = async () => { setSaving(true); await api('/settings', { method: 'PUT', body: JSON.stringify(settings) }); setSaving(false); alert(t('ai.saveSuccess')) }
  const testAI = async () => {
    await api('/settings', { method: 'PUT', body: JSON.stringify(settings) })
    const res = await api('/ai/test', { method: 'POST' })
    setTestResult(res)
  }
  const pi = t('ai.providers', { returnObjects: true })
  const mi = t('ai.modelsInfo', { returnObjects: true })
  const presets = [
    { name: 'OpenAI', baseUrl: 'https://api.openai.com', model: 'gpt-4o-mini' },
    { name: '智谱AI (GLM)', baseUrl: 'https://open.bigmodel.cn/api/paas', model: 'glm-4-flash' },
    { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com', model: 'deepseek-chat' },
    { name: '通义千问', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode', model: 'qwen-turbo' },
    { name: '月之暗面 (Kimi)', baseUrl: 'https://api.moonshot.cn', model: 'moonshot-v1-8k' },
    { name: '自定义 (OpenAI兼容)', baseUrl: '', model: '' },
  ]
  const supportedList = [
    { key: 'openai', models: mi.openai, note: t('ai.needOversea') },
    { key: 'zhipu', models: mi.zhipu, note: t('ai.freeQuota') },
    { key: 'deepseek', models: mi.deepseek, note: t('ai.costEffective') },
    { key: 'tongyi', models: mi.tongyi, note: t('ai.aliyun') },
    { key: 'moonshot', models: mi.moonshot, note: t('ai.domestic') },
    { key: 'lingyi', models: mi.lingyi, note: t('ai.domestic') },
  ]
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="card-glass p-6">
        <h3 className="text-yellow-300 font-bold mb-4">{t('ai.title')}</h3>
        <p className="text-purple-300/50 text-sm mb-6">{t('ai.desc')}</p>
        <div className="mb-4">
          <label className="block text-sm text-purple-300/60 mb-2">{t('ai.selectProvider')}</label>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <button key={p.name} onClick={() => { update('ai_base_url', p.baseUrl); update('ai_model', p.model) }}
                className="px-3 py-1.5 rounded-lg text-sm transition-all"
                style={{background: settings.ai_base_url === p.baseUrl ? 'linear-gradient(135deg, #a21caf, #7c3aed)' : 'rgba(30,15,60,0.6)', border: `1px solid ${settings.ai_base_url === p.baseUrl ? 'rgba(217,70,239,0.6)' : 'rgba(217,70,239,0.2)'}`, color: settings.ai_base_url === p.baseUrl ? 'white' : 'rgba(196,181,253,0.8)'}}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-purple-300/60 mb-1">{t('ai.enableAi')}</label>
            <button onClick={() => update('ai_enabled', settings.ai_enabled === 'true' ? 'false' : 'true')}
              className="px-4 py-2 rounded-xl text-sm"
              style={{background: settings.ai_enabled === 'true' ? 'linear-gradient(135deg, #16a34a, #22c55e)' : 'rgba(30,15,60,0.6)', border: `1px solid ${settings.ai_enabled === 'true' ? 'rgba(34,197,94,0.5)' : 'rgba(217,70,239,0.2)'}`, color: settings.ai_enabled === 'true' ? 'white' : 'rgba(196,181,253,0.8)'}}>
              {settings.ai_enabled === 'true' ? t('ai.enabled') : t('ai.disabled')}
            </button>
          </div>
          <div><label className="block text-sm text-purple-300/60 mb-1">{t('ai.baseUrl')}</label><input className="input-mystic w-full" placeholder="https://api.openai.com" value={settings.ai_base_url || ''} onChange={e => update('ai_base_url', e.target.value)} /></div>
          <div><label className="block text-sm text-purple-300/60 mb-1">{t('ai.apiKey')}</label><input className="input-mystic w-full" type="password" placeholder="sk-..." value={settings.ai_api_key || ''} onChange={e => update('ai_api_key', e.target.value)} /></div>
          <div><label className="block text-sm text-purple-300/60 mb-1">{t('ai.model')}</label><input className="input-mystic w-full" placeholder="gpt-4o-mini / glm-4-flash" value={settings.ai_model || ''} onChange={e => update('ai_model', e.target.value)} /></div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={save} disabled={saving} className="btn-gold">{saving ? t('ai.saving') : t('ai.saveBtn')}</button>
          <button onClick={testAI} className="btn-mystic">{t('ai.testBtn')}</button>
        </div>
        {testResult && (
          <div className={`mt-4 p-4 rounded-xl text-sm ${testResult.success ? 'bg-green-500/20 border border-green-500/30 text-green-300' : 'bg-red-500/20 border border-red-500/30 text-red-300'}`}>
            {testResult.success ? <div>{t('ai.connectionSuccess')} Model: {testResult.model} | Reply: {testResult.reply}</div> : <div>{t('ai.connectionFailed')}: {testResult.error}</div>}
          </div>
        )}
      </div>
      <div className="card-glass p-6">
        <h3 className="text-yellow-300 font-bold mb-3">{t('ai.supportedProviders')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {supportedList.map(p => (
            <div key={p.key} className="p-3 rounded-xl" style={{background: 'rgba(30,15,60,0.5)', border: '1px solid rgba(217,70,239,0.15)'}}>
              <div className="font-bold text-purple-200">{p.key === 'openai' ? 'OpenAI' : p.key === 'zhipu' ? t('ai.providers.zhipu.name') : p.key === 'deepseek' ? 'DeepSeek' : p.key === 'tongyi' ? t('ai.providers.tongyi.name') : p.key === 'moonshot' ? t('ai.providers.moonshot.name') : p.key === 'lingyi' ? '零一万物' : 'Custom'}</div>
              <div className="text-purple-300/50 text-xs mt-1">{t('ai.models')}: {p.models}</div>
              <div className="text-purple-300/40 text-xs">{p.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function UserManagement() {
  const { t } = useTranslation('admin')
  const [data, setData] = useState({ users: [], total: 0 })
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const load = () => api(`/users?page=${page}&search=${encodeURIComponent(search)}`).then(setData)
  useEffect(() => { load() }, [page, search])
  const toggleVip = async (id, current) => { await api(`/users/${id}/vip`, { method: 'PUT', body: JSON.stringify({ isVip: !current }) }); load() }
  const deleteUser = async (id) => { if (!confirm(t('users.confirmDelete'))) return; await api(`/users/${id}`, { method: 'DELETE' }); load() }
  return (
    <div className="space-y-4">
      <input className="input-mystic w-full max-w-md" placeholder={t('users.search')} value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
      <div className="card-glass overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/10">
            <th className="text-left p-3 text-purple-300/60 font-normal">{t('users.username')}</th>
            <th className="text-left p-3 text-purple-300/60 font-normal">{t('users.nickname')}</th>
            <th className="text-center p-3 text-purple-300/60 font-normal">{t('users.vip')}</th>
            <th className="text-center p-3 text-purple-300/60 font-normal">{t('users.points')}</th>
            <th className="text-left p-3 text-purple-300/60 font-normal">{t('users.registerTime')}</th>
            <th className="text-right p-3 text-purple-300/60 font-normal">{t('users.action')}</th>
          </tr></thead>
          <tbody>
            {data.users.map(u => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-3 text-purple-200">{u.username}</td>
                <td className="p-3 text-purple-200/80">{u.nickname}</td>
                <td className="p-3 text-center"><button onClick={() => toggleVip(u.id, u.is_vip)} className={`px-2 py-1 rounded text-xs ${u.is_vip ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/5 text-purple-300/50'}`}>{u.is_vip ? t('users.vipLabel') : t('users.normal')}</button></td>
                <td className="p-3 text-center text-purple-200/80">{u.points || 0}</td>
                <td className="p-3 text-purple-300/50 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-right"><button onClick={() => deleteUser(u.id)} className="text-red-400/60 hover:text-red-400 text-xs">{t('users.delete')}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center gap-2">
        {Array.from({length: Math.ceil(data.total / 20)}, (_, i) => (
          <button key={i} onClick={() => setPage(i+1)} className={`w-8 h-8 rounded-lg text-sm ${page === i+1 ? 'bg-purple-600 text-white' : 'bg-white/5 text-purple-300/60'}`}>{i+1}</button>
        ))}
      </div>
    </div>
  )
}

function RecordManagement() {
  const { t } = useTranslation('admin')
  const [data, setData] = useState({ records: [], total: 0 })
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const load = () => api(`/records?page=${page}&type=${filter}`).then(setData)
  useEffect(() => { load() }, [page, filter])
  const tn = t('typeNames', { returnObjects: true })
  const types = ['', 'tarot', 'zodiac', 'eight-char', 'iching', 'name', 'sign', 'dream']
  const typeFilterNames = { '': t('records.all'), tarot: tn.tarot, zodiac: tn.zodiac, 'eight-char': tn['eight-char'], iching: tn.iching, name: tn.name, sign: tn.sign, dream: tn.dream }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {types.map(tp => (
          <button key={tp} onClick={() => { setFilter(tp); setPage(1) }}
            className="px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{background: filter === tp ? 'linear-gradient(135deg, #a21caf, #7c3aed)' : 'rgba(30,15,60,0.6)', border: `1px solid ${filter === tp ? 'rgba(217,70,239,0.6)' : 'rgba(217,70,239,0.2)'}`, color: filter === tp ? 'white' : 'rgba(196,181,253,0.8)'}}>
            {typeFilterNames[tp] || tp}
          </button>
        ))}
      </div>
      <div className="card-glass overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/10">
            <th className="text-left p-3 text-purple-300/60 font-normal">{t('records.type')}</th>
            <th className="text-left p-3 text-purple-300/60 font-normal">{t('records.user')}</th>
            <th className="text-left p-3 text-purple-300/60 font-normal">{t('records.question')}</th>
            <th className="text-left p-3 text-purple-300/60 font-normal">{t('records.time')}</th>
            <th className="text-right p-3 text-purple-300/60 font-normal">{t('records.action')}</th>
          </tr></thead>
          <tbody>
            {data.records.map(r => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-3 text-purple-200">{tn[r.type] || r.type}</td>
                <td className="p-3 text-purple-200/80">{r.username || t('dashboard.anonymous')}</td>
                <td className="p-3 text-purple-300/60 truncate max-w-[200px]">{r.question || '-'}</td>
                <td className="p-3 text-purple-300/50 text-xs">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-3 text-right"><button onClick={async () => { await api(`/records/${r.id}`, { method: 'DELETE' }); load() }} className="text-red-400/60 hover:text-red-400 text-xs">{t('records.delete')}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SettingsPanel() {
  const { t } = useTranslation('admin')
  const [settings, setSettings] = useState({})
  useEffect(() => { api('/settings').then(setSettings) }, [])
  const save = async () => { await api('/settings', { method: 'PUT', body: JSON.stringify(settings) }); alert(t('settings.saveSuccess')) }
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="card-glass p-6 space-y-4">
        <h3 className="text-yellow-300 font-bold">{t('settings.title')}</h3>
        <div><label className="block text-sm text-purple-300/60 mb-1">{t('settings.siteName')}</label><input className="input-mystic w-full" value={settings.site_name || '神秘占卜馆'} onChange={e => setSettings({...settings, site_name: e.target.value})} /></div>
        <div><label className="block text-sm text-purple-300/60 mb-1">{t('settings.announcement')}</label><textarea className="input-mystic w-full h-24" value={settings.announcement || ''} onChange={e => setSettings({...settings, announcement: e.target.value})} /></div>
        <button onClick={save} className="btn-gold">{t('settings.save')}</button>
      </div>
    </div>
  )
}

function PaymentConfig() {
  const { t } = useTranslation('admin')
  const [config, setConfig] = useState({
    wechat_enabled: 'false', wechatAppId: '', wechatMchId: '', wechatApiKey: '', wechatNotifyUrl: '',
    alipay_enabled: 'false', alipayAppId: '', alipayPrivateKey: '', alipayPublicKey: '', alipayNotifyUrl: '',
    payNotifyHost: 'http://47.86.9.65',
  })
  const [status, setStatus] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [testResult, setTestResult] = useState(null)
  const [showKeys, setShowKeys] = useState({})

  useEffect(() => {
    api('/settings').then(data => { if (data) setConfig(prev => ({ ...prev, ...data })) })
    api('/payment/status').then(setStatus)
  }, [])

  const update = (key, val) => setConfig(prev => ({ ...prev, [key]: val }))
  const save = async () => {
    setSaving(true); setMsg('')
    const res = await api('/settings', { method: 'PUT', body: JSON.stringify(config) })
    setSaving(false)
    if (res.success) { setMsg(t('payment.saveSuccess')); api('/payment/status').then(setStatus) }
    else setMsg(t('payment.saveFailed'))
  }
  const testPay = async (channel) => { setTestResult(null); const res = await api('/payment/test', { method: 'POST', body: JSON.stringify({ channel }) }); setTestResult({ channel, ...res }) }

  const Field = ({ label, field, type = 'text', placeholder = '', secret }) => (
    <div className="mb-4">
      <label className="block text-sm text-purple-300/60 mb-1">{label}</label>
      <div className="relative">
        <input type={secret && !showKeys[field] ? 'password' : type} value={config[field] || ''} placeholder={placeholder} onChange={e => update(field, e.target.value)} className="input-mystic w-full pr-10" />
        {secret && <button onClick={() => setShowKeys(p => ({...p, [field]: !p[field]}))} className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-300/40 hover:text-white text-sm">{showKeys[field] ? '🙈' : '👁️'}</button>}
      </div>
    </div>
  )
  const Toggle = ({ field }) => (
    <button onClick={() => update(field, config[field] === 'true' ? 'false' : 'true')}
      className="px-4 py-2 rounded-xl text-sm transition-all"
      style={{background: config[field] === 'true' ? 'linear-gradient(135deg, #16a34a, #22c55e)' : 'rgba(30,15,60,0.6)', border: '1px solid ' + (config[field] === 'true' ? 'rgba(34,197,94,0.5)' : 'rgba(217,70,239,0.2)'), color: config[field] === 'true' ? 'white' : 'rgba(196,181,253,0.8)'}}>
      {config[field] === 'true' ? t('payment.enabled') : t('payment.disabled')}
    </button>
  )
  const ws = t('payment.wechatSteps', { returnObjects: true })
  const as = t('payment.alipaySteps', { returnObjects: true })

  return (
    <div className="space-y-6 max-w-3xl">
      {msg && <div className={msg.includes("✅") || msg.includes("success") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"} style={{padding: "12px", borderRadius: "12px", fontSize: "14px"}}>{msg}</div>}
      {status && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-glass p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 font-bold">{t('payment.wechat')}</p>
                <p className="text-xs text-purple-300/50 mt-1">{status.wechat?.enabled ? t('payment.enabled') : t('payment.disabled')} · {status.wechat?.configured ? t('payment.configured') : t('payment.notConfigured')}</p>
              </div>
              <button onClick={() => testPay('wechat')} className="btn-mystic text-xs">{t('payment.test')}</button>
            </div>
          </div>
          <div className="card-glass p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 font-bold">{t('payment.alipay')}</p>
                <p className="text-xs text-purple-300/50 mt-1">{status.alipay?.enabled ? t('payment.enabled') : t('payment.disabled')} · {status.alipay?.configured ? t('payment.configured') : t('payment.notConfigured')}</p>
              </div>
              <button onClick={() => testPay('alipay')} className="btn-mystic text-xs">{t('payment.test')}</button>
            </div>
          </div>
        </div>
      )}
      {testResult && (
        <div className={testResult.success ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"} style={{padding: "12px", borderRadius: "12px", fontSize: "14px"}}>
          {testResult.channel === 'wechat' ? t('payment.wechat') : t('payment.alipay')}: {testResult.success ? '✅ ' + testResult.message : '⚠️ ' + testResult.error}
        </div>
      )}
      <div className="card-glass p-6">
        <h3 className="text-yellow-300 font-bold mb-4">{t('payment.callback')}</h3>
        <Field label={t('payment.serverHost')} field="payNotifyHost" placeholder="http://47.86.9.65" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div><label className="block text-sm text-purple-300/60 mb-1">{t('payment.wechatCallback')}</label><div className="px-3 py-2 bg-purple-900/30 rounded-lg text-purple-200/80 text-xs font-mono border border-purple-500/20">{(config.payNotifyHost || 'http://47.86.9.65')}/api/pay/callback/wechat</div></div>
          <div><label className="block text-sm text-purple-300/60 mb-1">{t('payment.alipayCallback')}</label><div className="px-3 py-2 bg-purple-900/30 rounded-lg text-purple-200/80 text-xs font-mono border border-purple-500/20">{(config.payNotifyHost || 'http://47.86.9.65')}/api/pay/callback/alipay</div></div>
        </div>
        <p className="text-xs text-yellow-400/60 mt-3">{t('payment.callbackWarning')}</p>
      </div>
      <div className="card-glass p-6">
        <div className="flex items-center justify-between mb-4"><h3 className="text-yellow-300 font-bold">{t('payment.wechatConfig')}</h3><Toggle field="wechat_enabled" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t('payment.appId')} field="wechatAppId" placeholder="wx1234567890abcdef" />
          <Field label={t('payment.mchId')} field="wechatMchId" placeholder="1234567890" />
          <Field label={t('payment.apiKey') + ' (32位)'} field="wechatApiKey" placeholder="MD5 Key" secret />
          <Field label={t('payment.customCallback')} field="wechatNotifyUrl" placeholder={t('payment.leaveEmpty')} />
        </div>
        <div className="mt-4 p-4 bg-purple-900/20 rounded-xl border border-purple-500/10">
          <p className="text-sm text-purple-200 font-bold mb-2">{t('payment.steps')}</p>
          <ol className="text-xs text-purple-300/50 space-y-1 list-decimal list-inside">{Array.isArray(ws) && ws.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </div>
      </div>
      <div className="card-glass p-6">
        <div className="flex items-center justify-between mb-4"><h3 className="text-yellow-300 font-bold">{t('payment.alipayConfig')}</h3><Toggle field="alipay_enabled" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t('payment.appId')} field="alipayAppId" placeholder="2021001234567890" />
          <Field label={t('payment.customCallback')} field="alipayNotifyUrl" placeholder={t('payment.leaveEmpty')} />
        </div>
        <Field label={t('payment.apiKey') + ' (Private)'} field="alipayPrivateKey" placeholder="MIIEvQ..." secret />
        <Field label={t('payment.apiKey') + ' (Public)'} field="alipayPublicKey" placeholder="MIIBIjAN..." secret />
        <div className="mt-4 p-4 bg-purple-900/20 rounded-xl border border-purple-500/10">
          <p className="text-sm text-purple-200 font-bold mb-2">{t('payment.steps')}</p>
          <ol className="text-xs text-purple-300/50 space-y-1 list-decimal list-inside">{Array.isArray(as) && as.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </div>
      </div>
      <button onClick={save} disabled={saving} className="btn-gold">{saving ? t('payment.saving') : t('payment.saveBtn')}</button>
    </div>
  )
}

export default function Admin() {
  const { t } = useTranslation('admin')
  const [admin, setAdmin] = useState(null)
  const [tab, setTab] = useState('dashboard')
  const [stats, setStats] = useState({})

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) { fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => { if (!d.error) setStats(d) }) }
  }, [tab])

  if (!admin) return <Login onLogin={setAdmin} />

  const tabs = [
    { key: 'dashboard', label: t('sidebar.dashboard'), icon: '📊' },
    { key: 'traffic', label: t('sidebar.traffic'), icon: '📈' },
    { key: 'users', label: t('sidebar.users'), icon: '👥' },
    { key: 'records', label: t('sidebar.records'), icon: '🔮' },
    { key: 'ai', label: t('sidebar.ai'), icon: '🤖' },
    { key: 'settings', label: t('sidebar.settings'), icon: '⚙️' },
    { key: 'payment', label: t('sidebar.payment'), icon: '💳' },
  ]

  const render = () => {
    switch(tab) {
      case 'dashboard': return <Dashboard stats={stats} />
      case 'traffic': return <TrafficStats stats={stats} />
      case 'users': return <UserManagement />
      case 'records': return <RecordManagement />
      case 'ai': return <AIConfig />
      case 'settings': return <SettingsPanel />
      case 'payment': return <PaymentConfig />
      default: return null
    }
  }

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #0f0524 0%, #1a0a3e 50%, #0d0318 100%)'}}>
      <div className="flex min-h-screen">
        <div className="w-56 flex-shrink-0 p-4 border-r border-white/5">
          <div className="text-center mb-6">
            <div className="text-3xl mb-1">🔮</div>
            <div className="text-sm text-yellow-300 font-bold">{t('title')}</div>
            <div className="text-xs text-purple-300/40 mt-1">{t('subtitle')}</div>
          </div>
          <nav className="space-y-1">
            {tabs.map(tp => (
              <button key={tp.key} onClick={() => setTab(tp.key)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left"
                style={{background: tab === tp.key ? 'linear-gradient(135deg, rgba(162,28,175,0.3), rgba(124,58,237,0.3))' : 'transparent', color: tab === tp.key ? '#e9d5ff' : 'rgba(196,181,253,0.5)', border: tab === tp.key ? '1px solid rgba(217,70,239,0.3)' : '1px solid transparent'}}>
                <span>{tp.icon}</span><span>{tp.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-8 pt-4 border-t border-white/5">
            <button onClick={() => { localStorage.removeItem('admin_token'); setAdmin(null) }} className="w-full text-left px-3 py-2 text-sm text-purple-300/40 hover:text-red-400 transition-colors">🚪 {t('logout')}</button>
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-purple-200 mb-6">{tabs.find(tp => tp.key === tab)?.icon} {tabs.find(tp => tp.key === tab)?.label}</h2>
          {render()}
        </div>
      </div>
    </div>
  )
}
