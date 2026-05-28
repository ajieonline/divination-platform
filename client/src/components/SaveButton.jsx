import React, { useContext } from 'react'
import { AuthContext } from '../App'

export default function SaveButton({ type, question, result }) {
  const { user, token } = useContext(AuthContext)
  const [saved, setSaved] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const save = async () => {
    if (!user) {
      // Redirect to profile page for login
      window.location.href = '/profile'
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ type, question, result: JSON.stringify(result) })
      })
      if (res.ok) setSaved(true)
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  if (saved) {
    return (
      <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
        <span>✅</span><span>已保存到我的记录</span>
      </div>
    )
  }

  return (
    <button onClick={save} disabled={saving}
      className="w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
      style={{
        background: user ? 'linear-gradient(135deg, rgba(162,28,175,0.3), rgba(124,58,237,0.3))' : 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(236,72,153,0.15))',
        border: `1px solid ${user ? 'rgba(162,28,175,0.4)' : 'rgba(251,191,36,0.3)'}`,
        color: user ? 'rgb(233,213,255)' : 'rgb(253,224,71)'
      }}>
      {saving ? '保存中...' : user ? '💾 保存到我的记录' : '🔐 登录后保存记录'}
    </button>
  )
}
