import React, { useState, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { AuthContext } from '../App'
import Dropdown from '../components/Dropdown'

const zodiacList = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces']
const zodiacNames = {
  zh: { aries:'白羊座',taurus:'金牛座',gemini:'双子座',cancer:'巨蟹座',leo:'狮子座',virgo:'处女座',libra:'天秤座',scorpio:'天蝎座',sagittarius:'射手座',capricorn:'摩羯座',aquarius:'水瓶座',pisces:'双鱼座' },
  en: { aries:'Aries',taurus:'Taurus',gemini:'Gemini',cancer:'Cancer',leo:'Leo',virgo:'Virgo',libra:'Libra',scorpio:'Scorpio',sagittarius:'Sagittarius',capricorn:'Capricorn',aquarius:'Aquarius',pisces:'Pisces' }
}
const zodiacIcons = { aries:'♈',taurus:'♉',gemini:'♊',cancer:'♋',leo:'♌',virgo:'♍',libra:'♎',scorpio:'♏',sagittarius:'♐',capricorn:'♑',aquarius:'♒',pisces:'♓' }

const hours = [
  { value: 0, zh: '子时(23-1点)', en: 'Zi (23-1)' }, { value: 1, zh: '丑时(1-3点)', en: 'Chou (1-3)' },
  { value: 2, zh: '寅时(3-5点)', en: 'Yin (3-5)' }, { value: 3, zh: '卯时(5-7点)', en: 'Mao (5-7)' },
  { value: 4, zh: '辰时(7-9点)', en: 'Chen (7-9)' }, { value: 5, zh: '巳时(9-11点)', en: 'Si (9-11)' },
  { value: 6, zh: '午时(11-13点)', en: 'Wu (11-13)' }, { value: 7, zh: '未时(13-15点)', en: 'Wei (13-15)' },
  { value: 8, zh: '申时(15-17点)', en: 'Shen (15-17)' }, { value: 9, zh: '酉时(17-19点)', en: 'You (17-19)' },
  { value: 10, zh: '戌时(19-21点)', en: 'Xu (19-21)' }, { value: 11, zh: '亥时(21-23点)', en: 'Hai (21-23)' }
]

export default function Profile() {
  const { t, i18n } = useTranslation('profile')
  const tc = useTranslation('common')
  const { user, token, login, logout } = useContext(AuthContext)
  const lang = i18n.language?.startsWith('en') ? 'en' : 'zh'
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ username: '', password: '', nickname: '' })
  const [loading, setLoading] = useState(false)
  const [profileForm, setProfileForm] = useState({ nickname: '', realName: '', gender: '', zodiac: '', birthday: '', birthHour: '', phone: '', email: '' })
  const [profileMsg, setProfileMsg] = useState('')
  const [records, setRecords] = useState([])

  useEffect(() => {
    if (user) {
      setProfileForm({
        nickname: user.nickname || '',
        realName: user.realName || user.real_name || '',
        gender: user.gender || '',
        zodiac: user.zodiac || '',
        birthday: user.birthday || '',
        birthHour: user.birthHour ?? user.birth_hour ?? '',
        phone: user.phone || '',
        email: user.email || ''
      })
      fetch('/api/records', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json()).then(d => { if (d.records) setRecords(d.records) }).catch(() => {})
    }
  }, [user, token])

  const doAuth = async () => {
    if (!form.username || !form.password) return
    setLoading(true)
    try {
      const res = await fetch(`/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.token) { login(data.user || { username: form.username }, data.token) }
      else { alert(data.error || tc.t('common.error')) }
    } catch (e) { alert(tc.t('common.error')) }
    setLoading(false)
  }

  const saveProfile = async () => {
    setProfileMsg('')
    try {
      const payload = {
        nickname: profileForm.nickname,
        real_name: profileForm.realName,
        gender: profileForm.gender,
        zodiac: profileForm.zodiac,
        birthday: profileForm.birthday,
        birth_hour: profileForm.birthHour,
        phone: profileForm.phone,
        email: profileForm.email
      }
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (res.ok) {
        const saved = data.user || data
        login({
          ...saved,
          realName: saved.realName || saved.real_name || profileForm.realName,
          birthHour: saved.birthHour ?? saved.birth_hour ?? profileForm.birthHour
        }, token)
        setProfileMsg(t('saveSuccess'))
      }
      else { setProfileMsg(data.error || t('saveError')) }
    } catch (e) { setProfileMsg(t('networkError')) }
  }

  const typeLabels = t('recordLabels', { returnObjects: true })

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-8 rounded-xl">
          <h1 className="text-2xl font-bold text-purple-100 text-center mb-6">{t('userCenter')}</h1>
          <div className="flex gap-4 mb-6">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 rounded-lg font-bold transition ${isLogin ? 'bg-purple-600 text-white' : 'bg-purple-900/30 text-purple-300'}`}>
              {t('loginTab')}
            </button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 rounded-lg font-bold transition ${!isLogin ? 'bg-purple-600 text-white' : 'bg-purple-900/30 text-purple-300'}`}>
              {t('registerTab')}
            </button>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder={t('usernamePlaceholder')} value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} className="input-mystic w-full" />
            <input type="password" placeholder={t('passwordPlaceholder')} value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} className="input-mystic w-full" />
            {!isLogin && <input type="text" placeholder={t('nicknameOptional')} value={form.nickname}
              onChange={e => setForm({ ...form, nickname: e.target.value })} className="input-mystic w-full" />}
            <button onClick={doAuth} disabled={loading} className="w-full btn-mystic py-3">
              {loading ? t('processing') : isLogin ? t('loginTab') : t('registerTab')}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-purple-100">{t('title')}</h1>
          <button onClick={logout} className="text-sm text-red-400 hover:text-red-300">{tc.t('auth.logout')}</button>
        </div>

        <div className="card-glass p-6 rounded-xl mb-6">
          <h3 className="text-lg font-bold text-yellow-300 mb-4">
            🔮 {lang === 'en' ? 'Profile' : '个人资料'}{' '}
            <span className="text-sm font-normal text-purple-300/60">— {t('profileHint')}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'nickname', label: t('nickname'), field: 'nickname' },
              { key: 'realName', label: t('realName'), field: 'realName' },
              { key: 'gender', label: t('gender'), field: 'gender', dropdown: true, options: [
                { value: 'male', label: lang === 'en' ? 'Male' : '男' },
                { value: 'female', label: lang === 'en' ? 'Female' : '女' },
                { value: 'other', label: lang === 'en' ? 'Other' : '其他' }
              ]},
              { key: 'zodiac', label: t('zodiac'), field: 'zodiac', dropdown: true,
                options: zodiacList.map(z => ({ value: z, label: zodiacNames[lang][z], icon: zodiacIcons[z] })) },
              { key: 'birthday', label: t('birthday'), field: 'birthday', type: 'date' },
              { key: 'birthHour', label: t('birthHour'), field: 'birthHour', dropdown: true,
                options: hours.map(h => ({ value: h.value, label: h[lang] })) },
              { key: 'phone', label: t('phone'), field: 'phone' },
              { key: 'email', label: t('email'), field: 'email' }
            ].map(item => (
              <div key={item.key}>
                <label className="block text-sm text-purple-300/80 mb-1">{item.label}</label>
                {item.dropdown ? (
                  <Dropdown value={profileForm[item.field]} onChange={v => setProfileForm({ ...profileForm, [item.field]: v })}
                    options={item.options} placeholder={`—`} />
                ) : (
                  <input type={item.type || 'text'} value={profileForm[item.field]}
                    onChange={e => setProfileForm({ ...profileForm, [item.field]: e.target.value })}
                    className="input-mystic w-full" />
                )}
              </div>
            ))}
          </div>
          <button onClick={saveProfile} className="mt-4 px-6 py-2 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-500 transition">
            {tc.t('common.save')}
          </button>
          {profileMsg && <p className="mt-2 text-sm text-purple-300">{profileMsg}</p>}
        </div>

        {records.length > 0 && (
          <div className="card-glass p-6 rounded-xl">
            <h3 className="text-lg font-bold text-yellow-300 mb-4">📋 {lang === 'en' ? 'Records' : '占卜记录'}</h3>
            <div className="space-y-2">
              {records.slice(0, 10).map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-purple-500/10">
                  <span className="text-sm text-purple-200/80">{typeLabels[r.type] || r.type}</span>
                  <span className="text-xs text-purple-300/50">{new Date(r.created_at || r.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
