import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthContext } from '../App'
import MarkdownText from '../components/MarkdownText'

const animalOptions = [
  { key: 'rat', name: '鼠', years: '1960 / 1972 / 1984 / 1996 / 2008 / 2020', tone: '敏锐、机变、善于发现机会' },
  { key: 'ox', name: '牛', years: '1961 / 1973 / 1985 / 1997 / 2009 / 2021', tone: '稳健、耐心、重视长期积累' },
  { key: 'tiger', name: '虎', years: '1962 / 1974 / 1986 / 1998 / 2010 / 2022', tone: '果断、行动力强、适合开局破局' },
  { key: 'rabbit', name: '兔', years: '1963 / 1975 / 1987 / 1999 / 2011 / 2023', tone: '温和、审美好、擅长关系经营' },
  { key: 'dragon', name: '龙', years: '1964 / 1976 / 1988 / 2000 / 2012 / 2024', tone: '自信、格局感强、适合承担责任' },
  { key: 'snake', name: '蛇', years: '1965 / 1977 / 1989 / 2001 / 2013 / 2025', tone: '冷静、洞察力强、擅长策略选择' },
  { key: 'horse', name: '马', years: '1966 / 1978 / 1990 / 2002 / 2014 / 2026', tone: '自由、热情、需要清晰目标牵引' },
  { key: 'goat', name: '羊', years: '1967 / 1979 / 1991 / 2003 / 2015', tone: '细腻、共情强、适合创意与协作' },
  { key: 'monkey', name: '猴', years: '1968 / 1980 / 1992 / 2004 / 2016', tone: '聪明、灵活、善于快速试错' },
  { key: 'rooster', name: '鸡', years: '1969 / 1981 / 1993 / 2005 / 2017', tone: '审慎、重细节、适合优化流程' },
  { key: 'dog', name: '狗', years: '1970 / 1982 / 1994 / 2006 / 2018', tone: '可靠、重承诺、适合建立信任' },
  { key: 'pig', name: '猪', years: '1971 / 1983 / 1995 / 2007 / 2019', tone: '真诚、包容、适合稳定经营' },
]

const relationshipScenarios = [
  { key: 'single', name: '脱单机会', desc: '看见近期桃花、人际节奏和主动方向' },
  { key: 'couple', name: '稳定关系', desc: '分析沟通摩擦、亲密感和边界感' },
  { key: 'reunion', name: '复合判断', desc: '拆解真实期待、阻碍点和下一步动作' },
  { key: 'choice', name: '关系选择', desc: '帮助厘清暧昧、选择与自我需求' },
]

const focusOptions = [
  { key: 'career', name: '事业突破', desc: '岗位机会、上升路径、关键行动' },
  { key: 'wealth', name: '财务规划', desc: '收支节奏、风险意识、机会窗口' },
  { key: 'side', name: '副业探索', desc: '资源匹配、试错成本、启动节奏' },
  { key: 'decision', name: '重大选择', desc: '机会成本、压力来源、行动排序' },
]

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function readJson(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || '请求失败')
  return data
}

function PageHero({ eyebrow, title, subtitle, cta }) {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-300/25 bg-amber-300/10 text-amber-100 text-sm mb-4">
        <span>✦</span>{eyebrow}
      </div>
      <h1 className="text-3xl md:text-5xl font-bold text-purple-100 mb-3">{title}</h1>
      <p className="text-purple-200/65 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
      {cta && <div className="mt-5">{cta}</div>}
    </motion.section>
  )
}

function Notice() {
  return (
    <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100/80 leading-relaxed">
      本站内容定位为娱乐参考与个人成长建议，不构成确定性预测，也不替代医疗、法律、投资等专业意见。
    </div>
  )
}

function ResultPanel({ title, result }) {
  if (!result) return null
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-6 rounded-xl border border-amber-300/20 mt-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-yellow-300">{title}</h2>
        <span className="text-xs text-purple-200/50">{new Date(result.timestamp || Date.now()).toLocaleString()}</span>
      </div>
      {result.summary && <p className="text-purple-100/82 leading-relaxed mb-4">{result.summary}</p>}
      {Array.isArray(result.highlights) && (
        <div className="grid sm:grid-cols-3 gap-3 mb-5">
          {result.highlights.map((item) => (
            <div key={item.label} className="rounded-lg bg-purple-900/30 border border-purple-400/10 p-3">
              <div className="text-xs text-purple-300/50 mb-1">{item.label}</div>
              <div className="text-sm text-purple-100 font-semibold">{item.value}</div>
            </div>
          ))}
        </div>
      )}
      {result.reading && <MarkdownText text={result.reading} className="text-purple-100/78 text-sm leading-relaxed space-y-1" />}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link to="/reports" className="btn-gold text-sm">解锁深度报告</Link>
        <Link to="/consultants" className="btn-mystic text-sm">预约占卜师</Link>
      </div>
    </motion.div>
  )
}

function LoadingButton({ loading, children, ...props }) {
  return (
    <button disabled={loading || props.disabled} {...props}>
      {loading ? '正在连接星盘...' : children}
    </button>
  )
}

export function ZodiacAnimal() {
  const { token } = useContext(AuthContext)
  const [year, setYear] = useState('1990')
  const [animal, setAnimal] = useState('horse')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const selected = animalOptions.find(item => item.key === animal)

  const submit = async () => {
    setLoading(true)
    try {
      const data = await fetch('/api/zodiac-animal', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ year, animal }),
      }).then(readJson)
      setResult(data)
    } catch (err) {
      alert(err.message)
    }
    setLoading(false)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <PageHero eyebrow="生肖运势" title="十二生肖年度能量盘" subtitle="结合出生年份、生肖性格和当前年度节奏，生成更适合日常参考的行动建议。" />
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <div className="card-glass p-6 rounded-xl h-fit space-y-4">
          <Notice />
          <div>
            <label className="block text-sm text-purple-300/70 mb-2">出生年份</label>
            <input className="input-mystic w-full" value={year} onChange={e => setYear(e.target.value)} placeholder="例如 1990" />
          </div>
          <div>
            <label className="block text-sm text-purple-300/70 mb-2">或直接选择生肖</label>
            <div className="grid grid-cols-3 gap-2">
              {animalOptions.map(item => (
                <button key={item.key} onClick={() => setAnimal(item.key)} className={`rounded-lg border px-3 py-2 text-sm transition ${animal === item.key ? 'border-amber-300/60 bg-amber-300/15 text-amber-100' : 'border-white/10 bg-white/5 text-purple-100/70 hover:border-purple-300/30'}`}>
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          <LoadingButton loading={loading} onClick={submit} className="btn-gold w-full">查看生肖运势</LoadingButton>
        </div>
        <div className="space-y-4">
          {selected && (
            <div className="card-glass p-6 rounded-xl">
              <div className="text-sm text-purple-300/50 mb-2">当前选择</div>
              <h2 className="text-3xl font-bold text-yellow-300 mb-2">生肖{selected.name}</h2>
              <p className="text-purple-100/75 mb-3">{selected.tone}</p>
              <p className="text-xs text-purple-300/45">{selected.years}</p>
            </div>
          )}
          <ResultPanel title="生肖运势解读" result={result} />
        </div>
      </div>
    </main>
  )
}

export function LoveReading() {
  const { token } = useContext(AuthContext)
  const [scenario, setScenario] = useState('single')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const submit = async () => {
    if (!question.trim()) return alert('请先写下你最想确认的情感问题')
    setLoading(true)
    try {
      const data = await fetch('/api/relationship', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ scenario, question }),
      }).then(readJson)
      setResult(data)
    } catch (err) {
      alert(err.message)
    }
    setLoading(false)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <PageHero eyebrow="情感占卜" title="关系能量与情绪回应" subtitle="把暧昧、复合、亲密关系中的不确定感拆成可理解、可行动的建议。" />
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <div className="card-glass p-6 rounded-xl h-fit space-y-4">
          <Notice />
          <div className="grid sm:grid-cols-2 gap-3">
            {relationshipScenarios.map(item => (
              <button key={item.key} onClick={() => setScenario(item.key)} className={`rounded-lg border p-4 text-left transition ${scenario === item.key ? 'border-pink-300/60 bg-pink-300/12' : 'border-white/10 bg-white/5 hover:border-pink-300/30'}`}>
                <div className="font-bold text-purple-100">{item.name}</div>
                <div className="text-xs text-purple-300/55 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>
          <textarea className="input-mystic w-full h-32" value={question} onChange={e => setQuestion(e.target.value)} placeholder="例如：我们最近沟通变少了，这段关系接下来应该怎么推进？" />
          <LoadingButton loading={loading} onClick={submit} className="btn-mystic w-full">生成情感解读</LoadingButton>
        </div>
        <ResultPanel title="情感关系解读" result={result} />
      </div>
    </main>
  )
}

export function CareerWealth() {
  const { token } = useContext(AuthContext)
  const [focus, setFocus] = useState('career')
  const [profile, setProfile] = useState('')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const submit = async () => {
    if (!question.trim()) return alert('请写下你当前最关注的事业或财务问题')
    setLoading(true)
    try {
      const data = await fetch('/api/career-wealth', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ focus, profile, question }),
      }).then(readJson)
      setResult(data)
    } catch (err) {
      alert(err.message)
    }
    setLoading(false)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <PageHero eyebrow="事业财运" title="职业节奏与财富行动盘" subtitle="把目标、压力、机会和风险拆解成更清晰的行动优先级。" />
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <div className="card-glass p-6 rounded-xl h-fit space-y-4">
          <Notice />
          <div className="grid sm:grid-cols-2 gap-3">
            {focusOptions.map(item => (
              <button key={item.key} onClick={() => setFocus(item.key)} className={`rounded-lg border p-4 text-left transition ${focus === item.key ? 'border-cyan-300/60 bg-cyan-300/12' : 'border-white/10 bg-white/5 hover:border-cyan-300/30'}`}>
                <div className="font-bold text-purple-100">{item.name}</div>
                <div className="text-xs text-purple-300/55 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>
          <input className="input-mystic w-full" value={profile} onChange={e => setProfile(e.target.value)} placeholder="当前状态：例如在职、转岗、创业、学生等" />
          <textarea className="input-mystic w-full h-32" value={question} onChange={e => setQuestion(e.target.value)} placeholder="例如：我是否应该在今年换工作？应该重点准备什么？" />
          <LoadingButton loading={loading} onClick={submit} className="btn-gold w-full">生成事业财运建议</LoadingButton>
        </div>
        <ResultPanel title="事业财运分析" result={result} />
      </div>
    </main>
  )
}

export function Reports() {
  const { user, token } = useContext(AuthContext)
  const [reports, setReports] = useState([])
  const [order, setOrder] = useState(null)
  const [message, setMessage] = useState('')
  const [loadingProduct, setLoadingProduct] = useState('')

  useEffect(() => {
    fetch('/api/products/reports').then(readJson).then(d => setReports(d.reports || [])).catch(() => {})
  }, [])

  const buy = async (product) => {
    if (!user) {
      setMessage('请先登录，再解锁深度报告。')
      return
    }
    setLoadingProduct(product)
    setMessage('')
    try {
      const data = await fetch('/api/pay/create', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ product, payChannel: 'wechat' }),
      }).then(readJson)
      setOrder(data)
    } catch (err) {
      setMessage(err.message)
    }
    setLoadingProduct('')
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <PageHero eyebrow="付费深度报告" title="把一次占卜升级成完整人生参考报告" subtitle="报告包含核心结论、关系/事业/财务拆解、近期行动清单和复盘建议，适合需要更完整答案的用户。" />
      <div className="grid md:grid-cols-3 gap-6">
        {reports.map((item) => (
          <div key={item.product} className="pricing-card relative">
            {item.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-300 text-black text-xs font-bold rounded-full">{item.badge}</div>}
            <div className="text-xs text-purple-300/50 mb-2">{item.category}</div>
            <h2 className="text-xl font-bold text-purple-100 mb-2">{item.name}</h2>
            <p className="text-sm text-purple-300/60 leading-relaxed min-h-[64px]">{item.desc}</p>
            <div className="my-5">
              <span className="text-4xl font-bold text-yellow-300">¥{item.amount}</span>
              {item.original && <span className="ml-2 line-through text-purple-300/35">¥{item.original}</span>}
            </div>
            <ul className="space-y-2 mb-6">
              {(item.sections || []).map(section => <li key={section} className="text-sm text-purple-100/70">✓ {section}</li>)}
            </ul>
            <button onClick={() => buy(item.product)} className="btn-gold w-full text-sm" disabled={loadingProduct === item.product}>
              {loadingProduct === item.product ? '正在创建订单...' : '立即解锁'}
            </button>
          </div>
        ))}
      </div>
      {message && <div className="mt-6 rounded-lg border border-yellow-300/20 bg-yellow-300/10 p-4 text-yellow-100 text-sm">{message} <Link className="underline" to="/profile">前往登录</Link></div>}
      {order && (
        <div className="card-glass p-6 rounded-xl mt-8 max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-yellow-300 mb-2">订单已创建</h2>
          <p className="text-purple-200/70 text-sm mb-4">订单号：{order.orderNo}</p>
          {order.qrCode && <img src={order.qrCode} alt="支付二维码" className="mx-auto rounded-lg border border-white/10" />}
          {order.codeUrl && !order.qrCode && <p className="text-xs text-purple-300/50 break-all">{order.codeUrl}</p>}
          {order.payUrl && <a className="btn-gold inline-block mt-4" href={order.payUrl}>打开支付页</a>}
          {order.message && <p className="text-sm text-purple-200/60 mt-3">{order.message}</p>}
          <Link to="/orders" className="btn-mystic inline-block mt-4 text-sm">查看订单中心</Link>
        </div>
      )}
    </main>
  )
}

export function Consultants() {
  const { user, token } = useContext(AuthContext)
  const [consultants, setConsultants] = useState([])
  const [order, setOrder] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/consultants').then(readJson).then(d => setConsultants(d.consultants || [])).catch(() => {})
  }, [])

  const book = async (consultant) => {
    if (!user) {
      setMessage('请先登录后预约咨询。')
      return
    }
    try {
      const data = await fetch('/api/pay/create', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ product: 'consult_30', payChannel: 'wechat', consultantId: consultant.id }),
      }).then(readJson)
      setOrder({ ...data, consultant })
      setMessage('')
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <PageHero eyebrow="占卜师咨询" title="为重要问题预约一次深度对话" subtitle="按情感、事业、塔罗和成长方向匹配占卜师，适合需要更细致陪伴和复盘的场景。" />
      <div className="grid md:grid-cols-3 gap-6">
        {consultants.map(item => (
          <div key={item.id} className="card-glass p-6 rounded-xl">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="text-3xl mb-2">{item.symbol}</div>
                <h2 className="text-xl font-bold text-purple-100">{item.name}</h2>
                <p className="text-xs text-purple-300/50">{item.title}</p>
              </div>
              <div className="text-right">
                <div className="text-yellow-300 font-bold">¥{item.price}</div>
                <div className="text-xs text-purple-300/45">{item.duration}分钟</div>
              </div>
            </div>
            <p className="text-sm text-purple-100/70 leading-relaxed mb-4">{item.bio}</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {item.tags.map(tag => <span key={tag} className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-purple-200/70">{tag}</span>)}
            </div>
            <div className="flex items-center justify-between mb-5 text-xs text-purple-300/50">
              <span>评分 {item.rating}</span>
              <span>{item.orders} 次咨询</span>
            </div>
            <button className="btn-mystic w-full text-sm" onClick={() => book(item)}>预约咨询</button>
          </div>
        ))}
      </div>
      {message && <div className="mt-6 rounded-lg border border-yellow-300/20 bg-yellow-300/10 p-4 text-yellow-100 text-sm">{message}</div>}
      {order && (
        <div className="card-glass p-6 rounded-xl mt-8 max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-yellow-300 mb-2">咨询预约订单</h2>
          <p className="text-purple-200/70 text-sm">已为你预留：{order.consultant.name} · {order.orderNo}</p>
          {order.qrCode && <img src={order.qrCode} alt="支付二维码" className="mx-auto rounded-lg border border-white/10 mt-4" />}
          <Link to="/orders" className="btn-gold inline-block mt-4 text-sm">去订单中心查看</Link>
        </div>
      )}
    </main>
  )
}

export function Articles() {
  const [articles, setArticles] = useState([])
  const [active, setActive] = useState(null)

  useEffect(() => {
    fetch('/api/articles').then(readJson).then(d => {
      setArticles(d.articles || [])
      setActive((d.articles || [])[0] || null)
    }).catch(() => {})
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <PageHero eyebrow="内容资讯" title="星象、塔罗与个人成长灵感库" subtitle="用更轻的方式理解运势、关系、职业选择和自我成长。" />
      <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6">
        <div className="space-y-3">
          {articles.map(item => (
            <button key={item.id} onClick={() => setActive(item)} className={`w-full text-left card-glass p-4 rounded-xl transition ${active?.id === item.id ? 'border-amber-300/40' : ''}`}>
              <div className="text-xs text-purple-300/45 mb-1">{item.category} · {item.readTime}</div>
              <h2 className="text-lg font-bold text-purple-100">{item.title}</h2>
              <p className="text-sm text-purple-300/60 mt-2 line-clamp-2">{item.excerpt}</p>
            </button>
          ))}
        </div>
        {active && (
          <article className="card-glass p-6 rounded-xl h-fit">
            <div className="text-xs text-purple-300/45 mb-2">{active.category} · {active.readTime}</div>
            <h1 className="text-2xl font-bold text-yellow-300 mb-4">{active.title}</h1>
            <p className="text-purple-100/75 leading-relaxed mb-5">{active.excerpt}</p>
            <MarkdownText text={active.content} className="text-purple-100/75 text-sm leading-relaxed space-y-2" />
          </article>
        )}
      </div>
    </main>
  )
}

export function Campaigns() {
  const [campaigns, setCampaigns] = useState([])
  useEffect(() => {
    fetch('/api/campaigns').then(readJson).then(d => setCampaigns(d.campaigns || [])).catch(() => {})
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <PageHero eyebrow="活动专区" title="节日、生日与年度运势特别企划" subtitle="通过限时组合包、会员折扣和专题报告，承接用户在关键节点的仪式感需求。" />
      <div className="grid md:grid-cols-3 gap-6">
        {campaigns.map(item => (
          <div key={item.id} className="card-glass rounded-xl overflow-hidden">
            <div className="p-6" style={{ background: item.gradient }}>
              <div className="text-sm text-white/70">{item.period}</div>
              <h2 className="text-2xl font-bold text-white mt-2">{item.title}</h2>
              <p className="text-sm text-white/70 mt-2">{item.subtitle}</p>
            </div>
            <div className="p-6">
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold text-yellow-300">¥{item.price}</span>
                <span className="text-sm text-purple-300/45 line-through">¥{item.original}</span>
              </div>
              <ul className="space-y-2 mb-5">
                {item.includes.map(x => <li key={x} className="text-sm text-purple-100/70">✓ {x}</li>)}
              </ul>
              <Link to={item.link} className="btn-gold block text-center text-sm">参与活动</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export function Orders() {
  const { user, token } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  const load = () => {
    if (!token) return
    fetch('/api/orders', { headers: authHeaders(token) })
      .then(readJson)
      .then(d => setOrders(d.orders || []))
      .catch(err => setError(err.message))
  }

  useEffect(load, [token])

  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    expired: '已过期',
    refunded: '已退款',
  }

  if (!user) {
    return (
      <main className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="card-glass p-8 rounded-xl">
          <h1 className="text-2xl font-bold text-yellow-300 mb-3">订单中心</h1>
          <p className="text-purple-200/65 mb-6">登录后可查看你的会员、报告和咨询订单。</p>
          <Link to="/profile" className="btn-gold inline-block">前往登录</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <PageHero eyebrow="订单中心" title="你的报告、会员与咨询订单" subtitle="查看订单状态、支付渠道、金额和创建时间。" cta={<button onClick={load} className="btn-mystic text-sm">刷新订单</button>} />
      {error && <div className="rounded-lg border border-red-300/20 bg-red-300/10 p-4 text-red-100 text-sm mb-4">{error}</div>}
      <div className="space-y-3">
        {orders.length === 0 && <div className="card-glass p-6 rounded-xl text-center text-purple-200/60">暂无订单，去报告页或会员中心看看。</div>}
        {orders.map(order => (
          <div key={order.id} className="card-glass p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-sm text-purple-300/50">{order.order_no}</div>
              <h2 className="text-lg font-bold text-purple-100 mt-1">{order.productName || order.product}</h2>
              <div className="text-xs text-purple-300/45 mt-2">{new Date(order.created_at).toLocaleString()} · {order.pay_channel || 'wechat'}</div>
            </div>
            <div className="text-left md:text-right">
              <div className="text-2xl font-bold text-yellow-300">¥{order.amount}</div>
              <div className={`text-sm mt-1 ${order.status === 'paid' ? 'text-green-300' : order.status === 'pending' ? 'text-amber-200' : 'text-purple-300/50'}`}>{statusMap[order.status] || order.status}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export function Support() {
  const { token } = useContext(AuthContext)
  const [form, setForm] = useState({ category: 'payment', orderNo: '', contact: '', message: '' })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!form.message.trim()) return alert('请填写需要反馈的问题')
    setLoading(true)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(form),
      }).then(readJson)
      setDone(true)
      setForm({ category: 'payment', orderNo: '', contact: '', message: '' })
    } catch (err) {
      alert(err.message)
    }
    setLoading(false)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <PageHero eyebrow="客服反馈" title="把问题交给平台处理" subtitle="支付异常、报告问题、咨询服务、内容建议和投诉都可以在这里提交。" />
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <div className="card-glass p-6 rounded-xl h-fit">
          <h2 className="text-xl font-bold text-yellow-300 mb-4">服务承诺</h2>
          <div className="space-y-3 text-sm text-purple-100/70 leading-relaxed">
            <p>1. 支付与订单问题优先处理，建议填写订单号。</p>
            <p>2. 涉及退款、投诉和咨询履约的问题会进入客服工单。</p>
            <p>3. 高风险或敏感内容会升级人工复核。</p>
          </div>
        </div>
        <div className="card-glass p-6 rounded-xl space-y-4">
          {done && <div className="rounded-lg bg-green-300/10 border border-green-300/20 p-3 text-green-100 text-sm">已收到反馈，客服会尽快处理。</div>}
          <select className="input-mystic w-full" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="payment">支付/订单问题</option>
            <option value="report">报告内容问题</option>
            <option value="consult">咨询服务问题</option>
            <option value="content">内容建议</option>
            <option value="complaint">投诉与风险反馈</option>
          </select>
          <input className="input-mystic w-full" value={form.orderNo} onChange={e => setForm({ ...form, orderNo: e.target.value })} placeholder="订单号（选填）" />
          <input className="input-mystic w-full" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="联系方式（选填）" />
          <textarea className="input-mystic w-full h-36" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="请描述你遇到的问题或建议" />
          <button onClick={submit} disabled={loading} className="btn-gold w-full">{loading ? '正在提交...' : '提交反馈'}</button>
        </div>
      </div>
    </main>
  )
}
