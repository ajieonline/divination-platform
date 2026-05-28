const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const engine = require('./ai-engine');
const PaymentEngine = require('./payment-engine');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'divination-secret-key-2024';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
const db = new Database('/data/divination.db');
db.pragma('journal_mode = WAL');
const payEngine = new PaymentEngine(db);

// Request logging for traffic stats
app.use((req, res, next) => {
  if (req.path.startsWith('/api/') && req.path !== '/api/health') {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ts = new Date().toISOString();
    try {
      db.prepare('INSERT INTO api_logs (id, method, path, ip, user_agent, created_at) VALUES (?,?,?,?,?,?)')
        .run(uuidv4(), req.method, req.path, ip, (req.headers['user-agent'] || '').slice(0, 200), ts);
    } catch(e) {}
  }
  next();
});

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password_hash TEXT NOT NULL,
    nickname TEXT,
    is_vip INTEGER DEFAULT 0,
    vip_expire DATETIME,
    points INTEGER DEFAULT 0,
    last_checkin TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    real_name TEXT,
    gender TEXT,
    zodiac TEXT,
    birthday TEXT
  );
  CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS records (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    type TEXT NOT NULL,
    question TEXT,
    result TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_no TEXT UNIQUE NOT NULL,
    user_id TEXT,
    product TEXT NOT NULL,
    amount REAL NOT NULL,
    pay_channel TEXT,
    status TEXT DEFAULT 'pending',
    pay_time DATETIME,
    refund_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS api_logs (
    id TEXT PRIMARY KEY,
    method TEXT,
    path TEXT,
    ip TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Add missing columns if needed
try { db.exec("ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 0"); } catch(e) {}
try { db.exec("ALTER TABLE users ADD COLUMN last_checkin TEXT"); } catch(e) {}
try { db.exec("CREATE TABLE IF NOT EXISTS api_logs (id TEXT PRIMARY KEY, method TEXT, path TEXT, ip TEXT, user_agent TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"); } catch(e) {}

// Init default admin
const adminExists = db.prepare('SELECT id FROM admins WHERE username = ?').get('admin');
if (!adminExists) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admins (id, username, password_hash, role) VALUES (?, ?, ?, ?)').run(uuidv4(), 'admin', hash, 'superadmin');
  console.log('Default admin created: admin / admin123');
}

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return next();
  try { req.user = jwt.verify(token, JWT_SECRET); } catch(e) {}
  next();
}

function adminAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: '未登录' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ error: '无权限' });
    req.admin = decoded;
    next();
  } catch(e) { return res.status(401).json({ error: '登录已过期' }); }
}

function genOrderNo() { return 'ORD' + Date.now() + Math.random().toString(36).slice(2, 8).toUpperCase(); }

// ========== AUTH ==========
app.post('/api/auth/register', (req, res) => {
  const { username, password, nickname } = req.body;
  if (!username || !password) return res.status(400).json({ error: '请填写用户名和密码' });
  const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (exists) return res.status(400).json({ error: '用户名已存在' });
  const id = uuidv4();
  const hash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (id, username, password_hash, nickname) VALUES (?,?,?,?)').run(id, username, hash, nickname || username);
  const token = jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id, username, nickname: nickname || username, isVip: false } });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: '账号或密码错误' });
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, username: user.username, nickname: user.nickname, isVip: !!user.is_vip } });
});

app.get('/api/auth/me', auth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: '未登录' });
  const user = db.prepare('SELECT id, username, nickname, is_vip, points, birthday, zodiac, gender, real_name, birth_hour FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json({ ...user, isVip: !!user.is_vip });
});

// ========== TAROT ==========
app.post('/api/tarot/draw', auth, async (req, res) => {
  const { spread, question } = req.body;
  // VIP check: free users limited to 'single' spread, once per day
  if (req.user) {
    const userInfo = db.prepare('SELECT is_vip FROM users WHERE id = ?').get(req.user.id);
    if (!userInfo || !userInfo.is_vip) {
      if (spread !== 'single') {
        return res.status(403).json({ error: '免费用户仅可使用单牌占卜，开通VIP解锁全部牌阵' });
      }
      const today = new Date().toISOString().split('T')[0];
      const todayCount = db.prepare("SELECT COUNT(*) as c FROM records WHERE user_id = ? AND type = 'tarot' AND date(created_at) = ?").get(req.user.id, today);
      if (todayCount && todayCount.c >= 1) {
        return res.status(403).json({ error: '免费用户每天限1次塔罗占卜，开通VIP解锁无限次' });
      }
    }
  }
  const cards = engine.drawTarotCards(spread, question);

  // Try AI interpretation
  // Fetch user profile for personalized reading
    let userProfile = '';
    if (req.user) {
      const up = db.prepare('SELECT birthday, zodiac, gender, real_name FROM users WHERE id = ?').get(req.user.id);
      if (up) {
        if (up.real_name) userProfile += '求问者姓名：' + up.real_name + '\n';
        if (up.gender) userProfile += '求问者性别：' + up.gender + '\n';
        if (up.zodiac) userProfile += '求问者星座：' + up.zodiac + '\n';
        if (up.birthday) userProfile += '求问者生日：' + up.birthday + '\n';
      }
    }
    const aiText = await engine.callAI(
    '你是一位资深塔罗牌解读师，精通韦特塔罗和占星学。请根据抽到的牌阵和求问者的个人特质给出专业、深入、有洞察力的个性化解读。回答用中文，语气温暖而专业。解读要紧密结合求问者的星座、性格特征。',
    `请解读这个塔罗牌阵。\n牌阵类型：${spread === 'celtic' ? '凯尔特十字' : spread === 'three' ? '三牌阵' : '单牌占卜'}\n${userProfile ? '【求问者信息】\n' + userProfile : ''}${question ? '求问问题：' + question + '\n' : ''}\n抽到的牌：\n${cards.map((c, i) => `${c.position || '位置'+(i+1)}: ${c.fullName || c.name}（${c.suit}）${c.reversed ? '逆位' : '正位'} — ${c.meaning}`).join('\n')}\n\n请结合求问者的个人特质，给出：1.每张牌与求问者特质的关联解读 2.牌与牌之间的关联 3.针对求问者性格的个性化建议`,
    1000
  );

  if (aiText) {
    cards.forEach((c, i) => {
      c.aiReading = aiText.split('\n').filter(l => l.trim()).slice(i*3, i*3+3).join(' ') || c.reading;
    });
  }

  if (req.user) {
    try { db.prepare('INSERT INTO records (id, user_id, type, question, result) VALUES (?,?,?,?,?)').run(uuidv4(), req.user.id, 'tarot', question || '', JSON.stringify(cards)); } catch(e) {}
  }
  res.json({ cards, question, reading: aiText || null, timestamp: new Date().toISOString() });
});

// ========== ZODIAC ==========
app.get('/api/zodiac', (req, res) => {
  res.json(Object.entries(engine.zodiacData).map(([name, data]) => ({ name, ...data })));
});

app.get('/api/zodiac/:sign', (req, res) => {
  const z = decodeURIComponent(req.params.sign);
  const data = engine.zodiacData[z];
  if (!data) return res.status(404).json({ error: '未找到' });
  const fortune = engine.generateDailyFortune(z);
  res.json({ ...data, ...fortune, reading: fortune.overall, luckyDirection: '东方', fortune });
});

app.post('/api/zodiac/daily', (req, res) => {
  const { month, day } = req.body;
  const sign = engine.getZodiac(month, day);
  const fortune = engine.generateDailyFortune(sign);
  res.json({ sign, ...engine.zodiacData[sign], ...fortune, reading: fortune.overall, luckyDirection: '东方', fortune });
});

// ========== EIGHT CHARACTERS ==========
app.post('/api/eight-characters', async (req, res) => {
  try {
  const { year, month, day, hour } = req.body;
  if (!year || !month || !day) return res.status(400).json({ error: '请提供出生年月日时' });

  let result = engine.getEightCharacters(year, month, day, hour || 12);

  // Try AI enhanced interpretation
  // Fetch user profile for personalized analysis
    let userProfile8 = '';
    if (req.user) {
      const up8 = db.prepare('SELECT real_name, gender, zodiac FROM users WHERE id = ?').get(req.user.id);
      if (up8) {
        if (up8.real_name) userProfile8 += '姓名：' + up8.real_name + '\n';
        if (up8.gender) userProfile8 += '性别：' + up8.gender + '\n';
        if (up8.zodiac) userProfile8 += '星座：' + up8.zodiac + '\n';
      }
    }
    const aiText = await engine.callAI(
    '你是一位精通命理学的大师，擅长八字命理分析。请根据用户提供的生辰信息和个人特质给出专业、个性化的八字分析。回答用中文，要有深度和洞察力。分析要结合用户的性格特征和现实情况。',
    `请分析以下八字命理：\n${userProfile8 ? '【用户信息】\n' + userProfile8 : ''}出生时间：${year}年${month}月${day}日 ${['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][hour||12]}时\n四柱：${result.pillars.join(' ')}\n五行：金${result.wuxingBalance['金']} 木${result.wuxingBalance['木']} 水${result.wuxingBalance['水']} 火${result.wuxingBalance['火']} 土${result.wuxingBalance['土']}\n\n请结合用户个人特质，给出：1.性格深度分析 2.事业运势详解 3.感情运势详解 4.财运分析 5.健康提醒 6.综合建议`,
    1200
  );

  if (aiText) {
    result.aiAnalysis = aiText;
    result.personality = aiText.split('\n')[0] || result.personality;
    result.reading = aiText;
  }

  if (req.user) {
    try { db.prepare('INSERT INTO records (id, user_id, type, question, result) VALUES (?,?,?,?,?)').run(uuidv4(), req.user.id, 'eight-char', `${year}-${month}-${day}`, JSON.stringify(result)); } catch(e) {}
  }
  res.json(result);
  } catch (err) { console.error('Eight-char error:', err); res.status(500).json({ error: '分析失败，请稍后重试' }); }
});

// ========== I CHING ==========
app.post('/api/iching', auth, async (req, res) => {
  try {
  const { question } = req.body;
  const hex = engine.generateHexagram();

  // Fetch user profile for personalized reading
    let userProfileI = '';
    if (req.user) {
      const upI = db.prepare('SELECT real_name, gender, zodiac, birthday FROM users WHERE id = ?').get(req.user.id);
      if (upI) {
        if (upI.real_name) userProfileI += '求问者姓名：' + upI.real_name + '\n';
        if (upI.gender) userProfileI += '求问者性别：' + upI.gender + '\n';
        if (upI.zodiac) userProfileI += '求问者星座：' + upI.zodiac + '\n';
        if (upI.birthday) userProfileI += '求问者生日：' + upI.birthday + '\n';
      }
    }
    const aiText = await engine.callAI(
    '你是一位精通易经六爻的卦师，学贯古今。请根据卦象和求问者个人信息给出精准的、个性化的卦辞解读和实用建议。回答用中文，语气古朴而有智慧。',
    `请解读此卦：${hex.name}（${hex.symbol}）\n卦辞：${hex.interpretation}\n爻变信息：${hex.lines.map((l,i) => `${i+1}爻: ${l.type}${l.changing ? '(动爻)' : ''}`).join('、')}\n${userProfileI ? '【求问者信息】\n' + userProfileI : ''}${question ? '所问之事：' + question : ''}\n\n请结合求问者个人特质，给出：1.卦象解析 2.针对所问之事的个性化解读 3.爻变影响 4.针对求问者的具体建议`,
    1000
  );
  console.log('[IChing] AI result:', aiText ? aiText.slice(0, 100) + '...' : 'null (AI disabled or failed)');

  if (aiText) { hex.aiInterpretation = aiText; hex.reading = aiText; }

  if (req.user) {
    try { db.prepare('INSERT INTO records (id, user_id, type, question, result) VALUES (?,?,?,?,?)').run(uuidv4(), req.user.id, 'iching', question || '', JSON.stringify(hex)); } catch(e) {}
  }
  res.json({ ...hex, hexagram: hex.name, question, timestamp: new Date().toISOString() });
  } catch (err) { console.error('IChing error:', err.message); res.status(500).json({ error: '占卜失败，请稍后重试' }); }
});

// ========== NAME ==========
app.post('/api/name', auth, async (req, res) => {
  try {
  const { name, partnerName } = req.body;
  if (!name) return res.status(400).json({ error: '请输入姓名' });
  let r = engine.nameAnalysis(name);

  if (partnerName) {
    const r2 = engine.nameAnalysis(partnerName);
    r.compatibility = { ...r2 };
    r.match = Math.floor(Math.random() * 30) + 70;
  }

  const aiText = await engine.callAI(
    '你是一位精通姓名学的大师，擅长从笔画、五行、音韵等角度分析姓名。请给出专业的姓名分析。回答用中文。',
    `请分析姓名：${name}${partnerName ? '与' + partnerName + '的配对' : ''}\n笔画数：${r.totalStrokes}\n五行：${r.element}\n\n请给出：1.姓名含义解析 2.性格特点 ${partnerName ? '3.两人配对分析 4.相处建议' : '3.运势分析 4.建议'}`,
    800
  );

  if (aiText) { r.aiAnalysis = aiText; r.reading = aiText; }

  if (req.user) {
    try { db.prepare('INSERT INTO records (id, user_id, type, question, result) VALUES (?,?,?,?,?)').run(uuidv4(), req.user.id, 'name', name + (partnerName ? '&'+partnerName : ''), JSON.stringify(r)); } catch(e) {}
  }
  res.json(r);
  } catch (err) { console.error('Name error:', err.message); res.status(500).json({ error: '分析失败，请稍后重试' }); }
});

// ========== SIGN DRAW ==========
app.post('/api/sign/draw', auth, async (req, res) => {
  try {
  const { type = 'guanyin' } = req.body;
  const s = engine.signs[Math.floor(Math.random() * engine.signs.length)];

  const aiText = await engine.callAI(
    '你是一位解签大师，擅长从签文和诗词中解读人生指引。请给出深入的解签分析。回答用中文，语气温暖有智慧。',
    `请解签：\n签名：${s.title}\n签文：${s.poem}\n签意：${s.meaning}\n\n请给出：1.签文深意解析 2.当前运势分析 3.具体行动建议`,
    600
  );

  if (aiText) { s.aiInterpretation = aiText; s.reading = aiText; }

  if (req.user) {
    try { db.prepare('INSERT INTO records (id, user_id, type, question, result) VALUES (?,?,?,?,?)').run(uuidv4(), req.user.id, 'sign', type, JSON.stringify(s)); } catch(e) {}
  }
  res.json({ ...s, type, timestamp: new Date().toISOString() });
  } catch (err) { console.error('Sign draw error:', err.message); res.status(500).json({ error: '抽签失败，请稍后重试' }); }
});

// ========== DREAM ==========
app.post('/api/dream', async (req, res) => {
  try {
  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ error: '请输入梦境关键词' });

  let result = { keyword, ...engine.interpretDream(keyword) };

  const aiText = await engine.callAI(
    '你是一位解梦大师，精通弗洛伊德、荣格等心理学家的梦境分析理论，同时了解中国传统解梦文化。请给出专业、深入的梦境分析。回答用中文。',
    `请解析这个梦境：关键词「${keyword}」\n\n请给出：1.心理学角度分析 2.传统解梦角度 3.与现实生活的关联 4.潜在的心理暗示 5.行动建议`,
    800
  );

  if (aiText) { result.aiAnalysis = aiText; result.reading = aiText; }

  res.json({ ...result, timestamp: new Date().toISOString() });
  } catch (err) { console.error('Dream error:', err.message); res.status(500).json({ error: '解梦失败，请稍后重试' }); }
});

// ========== DAILY FORTUNE ==========
app.post('/api/daily-fortune', async (req, res) => {
  const { month, day } = req.body;
  const sign = engine.getZodiac(month, day);
  let result = { zodiac: sign, zodiacEmoji: engine.zodiacData[sign]?.emoji || '⭐', ...engine.generateDailyFortune(sign) };

  const aiText = await engine.callAI(
    '你是一位占星师，精通星座运势分析。请根据星座给出今日运势分析，包括事业、爱情、财运、健康、学业等方面。回答用中文，语气积极温暖。',
    `请给出${sign}今日的运势分析。\n\n请按以下格式给出：\n1.整体运势（用一句话概括+emoji）\n2.事业运势\n3.爱情运势\n4.财运分析\n5.健康提醒\n6.学业/成长\n7.幸运数字\n8.幸运颜色\n9.幸运方位\n10.今日建议`,
    800
  );

  if (aiText) {
    result.aiFortune = aiText;
    result.reading = aiText;
    const lines = aiText.split('\n').filter(l => l.trim());
    if (lines.length >= 10) {
      result.overall = lines[0].replace(/^[\d.、]+/, '').trim();
      result.luckyNumber = lines[6]?.match(/\d/)?.[0] || result.luckyNumber;
      result.luckyColor = lines[7]?.replace(/^[\d.、]+/, '').trim() || result.luckyColor;
      result.luckyDirection = lines[8]?.replace(/^[\d.、]+/, '').trim() || result.luckyDirection;
      result.advice = lines[9]?.replace(/^[\d.、]+/, '').trim() || result.advice;
    }
  }

  res.json(result);
});

// ========== USER ==========
app.post('/api/user/checkin', auth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: '请先登录' });
  const today = new Date().toISOString().split('T')[0];
  const user = db.prepare('SELECT last_checkin, points FROM users WHERE id = ?').get(req.user.id);
  if (user && user.last_checkin === today) return res.status(400).json({ error: '今天已经签到过了' });
  const isVip = db.prepare('SELECT is_vip FROM users WHERE id = ?').get(req.user.id);
  const basePoints = 10;
  const points = (isVip && isVip.is_vip) ? basePoints * 2 : basePoints;
  db.prepare('UPDATE users SET points = COALESCE(points,0) + ?, last_checkin = ? WHERE id = ?').run(points, today, req.user.id);
  res.json({ message: '签到成功', points, totalPoints: (user?.points || 0) + points, isVip: !!(isVip && isVip.is_vip) });
});

app.get('/api/user/checkin/status', auth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: '请先登录' });
  const today = new Date().toISOString().split('T')[0];
  const user = db.prepare('SELECT last_checkin, points FROM users WHERE id = ?').get(req.user.id);
  res.json({ checkedIn: !!(user && user.last_checkin === today), totalPoints: user?.points || 0 });
});

app.get('/api/user/points', auth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: '请先登录' });
  const user = db.prepare('SELECT points, is_vip FROM users WHERE id = ?').get(req.user.id);
  res.json({ points: user?.points || 0, isVip: !!user?.is_vip });
});

// ========== REDEEM ==========

// ========== USER PROFILE ==========
app.get('/api/user/profile', auth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: '请先登录' });
  const user = db.prepare('SELECT id, username, nickname, is_vip, points, birthday, zodiac, gender, real_name, birth_hour FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json({ ...user, isVip: !!user.is_vip });
});

app.put('/api/user/profile', auth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: '请先登录' });
  const { nickname, birthday, zodiac, gender, real_name, birth_hour } = req.body;
  const updates = [];
  const params = [];
  if (nickname !== undefined) { updates.push('nickname = ?'); params.push(nickname); }
  if (birthday !== undefined) { updates.push('birthday = ?'); params.push(birthday); }
  if (zodiac !== undefined) { updates.push('zodiac = ?'); params.push(zodiac); }
  if (gender !== undefined) { updates.push('gender = ?'); params.push(gender); }
  if (real_name !== undefined) { updates.push('real_name = ?'); params.push(real_name); }
  if (birth_hour !== undefined) { updates.push('birth_hour = ?'); params.push(birth_hour); }
  if (updates.length === 0) return res.status(400).json({ error: '没有要更新的字段' });
  params.push(req.user.id);
  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  const user = db.prepare('SELECT id, username, nickname, is_vip, points, birthday, zodiac, gender, real_name, birth_hour FROM users WHERE id = ?').get(req.user.id);
  res.json({ message: '资料已更新', user: { ...user, isVip: !!user.is_vip } });
});

app.post('/api/user/redeem', auth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: '请先登录' });
  const { item, cost } = req.body;
  if (!item || !cost) return res.status(400).json({ error: '参数错误' });
  const user = db.prepare('SELECT points FROM users WHERE id = ?').get(req.user.id);
  if (!user || user.points < cost) return res.status(400).json({ error: '积分不足' });
  db.prepare('UPDATE users SET points = points - ? WHERE id = ?').run(cost, req.user.id);
  // Record the redemption
  try { db.prepare('INSERT INTO records (id, user_id, type, question, result) VALUES (?,?,?,?,?)').run(
    require('uuid').v4(), req.user.id, 'redeem', item, JSON.stringify({ item, cost, redeemedAt: new Date().toISOString() })
  ); } catch(e) {}
  const updated = db.prepare('SELECT points FROM users WHERE id = ?').get(req.user.id);
  res.json({ message: '兑换成功', item, remainingPoints: updated.points });
});

// ========== SHARE POINTS ==========
app.post('/api/user/share', auth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: '请先登录' });
  const today = new Date().toISOString().split('T')[0];
  const already = db.prepare("SELECT id FROM records WHERE user_id = ? AND type = 'share' AND date(created_at) = ?").get(req.user.id, today);
  if (already) return res.status(400).json({ error: '今天已分享过' });
  db.prepare('UPDATE users SET points = COALESCE(points,0) + 20 WHERE id = ?').run(req.user.id);
  try { db.prepare('INSERT INTO records (id, user_id, type, question, result) VALUES (?,?,?,?,?)').run(
    require('uuid').v4(), req.user.id, 'share', '', JSON.stringify({ points: 20, date: today })
  ); } catch(e) {}
  const user = db.prepare('SELECT points FROM users WHERE id = ?').get(req.user.id);
  res.json({ message: '分享成功 +20分', totalPoints: user.points });
});

// ========== INVITE POINTS ==========
app.post('/api/user/invite', auth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: '请先登录' });
  const { invitedUsername } = req.body;
  if (!invitedUsername) return res.status(400).json({ error: '请提供被邀请用户名' });
  const invited = db.prepare('SELECT id FROM users WHERE username = ?').get(invitedUsername);
  if (!invited) return res.status(404).json({ error: '用户不存在' });
  const already = db.prepare("SELECT id FROM records WHERE user_id = ? AND type = 'invite' AND question = ?").get(req.user.id, invitedUsername);
  if (already) return res.status(400).json({ error: '已邀请过该用户' });
  db.prepare('UPDATE users SET points = COALESCE(points,0) + 100 WHERE id = ?').run(req.user.id);
  try { db.prepare('INSERT INTO records (id, user_id, type, question, result) VALUES (?,?,?,?,?)').run(
    require('uuid').v4(), req.user.id, 'invite', invitedUsername, JSON.stringify({ points: 100, invitedUsername })
  ); } catch(e) {}
  const user = db.prepare('SELECT points FROM users WHERE id = ?').get(req.user.id);
  res.json({ message: '邀请成功 +100分', totalPoints: user.points });
});

// ========== FIRST DIVINATION BONUS ==========
app.post('/api/user/first-divination', auth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: '请先登录' });
  const already = db.prepare("SELECT id FROM records WHERE user_id = ? AND type = 'first_divination'").get(req.user.id);
  if (already) return res.status(400).json({ error: '已领取过首次占卜奖励' });
  db.prepare('UPDATE users SET points = COALESCE(points,0) + 50 WHERE id = ?').run(req.user.id);
  try { db.prepare('INSERT INTO records (id, user_id, type, question, result) VALUES (?,?,?,?,?)').run(
    require('uuid').v4(), req.user.id, 'first_divination', '', JSON.stringify({ points: 50 })
  ); } catch(e) {}
  const user = db.prepare('SELECT points FROM users WHERE id = ?').get(req.user.id);
  res.json({ message: '首次占卜奖励 +50分', totalPoints: user.points });
});

app.get('/api/records', auth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: '请先登录' });
  const userInfo = db.prepare('SELECT is_vip FROM users WHERE id = ?').get(req.user.id);
  const limit = (userInfo && userInfo.is_vip) ? 999 : 5;
  const records = db.prepare('SELECT * FROM records WHERE user_id = ? ORDER BY created_at DESC LIMIT ?').all(req.user.id, limit);
  res.json({ records, isVip: !!(userInfo && userInfo.is_vip), limit });
});

app.post('/api/records', auth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: '请先登录' });
  const { type, question, result } = req.body;
  if (!type || !result) return res.status(400).json({ error: '缺少类型或结果' });
  try {
    const id = require('uuid').v4();
    db.prepare('INSERT INTO records (id, user_id, type, question, result) VALUES (?,?,?,?,?)').run(id, req.user.id, type, question || '', typeof result === 'string' ? result : JSON.stringify(result));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: '保存失败' });
  }
});

// ========== PAY ==========
const productNames = {
  vip_month: 'VIP月卡', vip_year: 'VIP年卡',
  tarot_single: '塔罗牌单次', tarot_three: '三牌阵', tarot_celtic: '凯尔特十字',
  iching_single: '易经六爻', name_match: '姓名配对', dream_single: 'AI解梦',
};

app.post('/api/pay/create', auth, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: '请先登录' });
  const { product, amount, payChannel } = req.body;
  if (!product || !amount) return res.status(400).json({ error: '缺少商品或金额' });
  const orderNo = genOrderNo();
  const id = uuidv4();
  const channel = payChannel || 'wechat';
  db.prepare('INSERT INTO orders (id, order_no, user_id, product, amount, pay_channel) VALUES (?,?,?,?,?,?)')
    .run(id, orderNo, req.user.id, product, amount, channel);
  const description = productNames[product] || product;
  try {
    if (channel === 'alipay') {
      const result = await payEngine.createAlipayOrder(orderNo, amount, description);
      res.json({ orderNo, orderId: id, payUrl: result.pay_url, channel: 'alipay' });
    } else {
      const result = await payEngine.createWechatNativeOrder(orderNo, amount, description);
      res.json({ orderNo, orderId: id, codeUrl: result.code_url, channel: 'wechat', simulated: result.simulated });
    }
  } catch (err) {
    res.json({ orderNo, orderId: id, channel, simulated: true,
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=divpay://' + orderNo,
      message: err.message || '支付渠道暂不可用' });
  }
});

app.get('/api/pay/status/:orderNo', auth, (req, res) => {
  const result = payEngine.getOrderStatus(req.params.orderNo);
  if (!result) return res.status(404).json({ error: '订单不存在' });
  res.json(result);
});

// ========== PAY CALLBACKS ==========
app.post('/api/pay/callback/wechat', (req, res) => {
  try {
    const order = payEngine.verifyWechatCallback(req.headers, JSON.stringify(req.body));
    if (order) { payEngine.handleWechatPaySuccess(order); console.log('[PAY] 微信支付成功: ' + order.order_no); }
    res.json({ code: 'SUCCESS', message: '成功' });
  } catch (err) { console.error('[PAY] 微信回调错误:', err.message); res.json({ code: 'SUCCESS', message: '成功' }); }
});

app.post('/api/pay/callback/alipay', (req, res) => {
  try {
    const order = payEngine.verifyAlipayCallback(req.body);
    if (order) { payEngine.handleAlipayPaySuccess(order); console.log('[PAY] 支付宝支付成功: ' + order.order_no); }
    res.send('success');
  } catch (err) { console.error('[PAY] 支付宝回调错误:', err.message); res.send('success'); }
});

// ========== PAY ADMIN ==========
app.get('/api/admin/payment/status', adminAuth, (req, res) => { res.json(payEngine.getPaymentStatus()); });

app.post('/api/admin/payment/test', adminAuth, async (req, res) => {
  const { channel } = req.body;
  const config = payEngine.getPaymentConfig();
  try {
    if (channel === 'wechat') {
      if (!config.wechatEnabled) return res.json({ success: false, error: '微信支付未启用' });
      if (!config.wechatAppId || !config.wechatMchId || !config.wechatApiKey) return res.json({ success: false, error: '微信支付配置不完整，请填写AppID、商户号和API密钥' });
      res.json({ success: true, message: '微信支付配置格式校验通过' });
    } else if (channel === 'alipay') {
      if (!config.alipayEnabled) return res.json({ success: false, error: '支付宝未启用' });
      if (!config.alipayAppId || !config.alipayPrivateKey || !config.alipayPublicKey) return res.json({ success: false, error: '支付宝配置不完整' });
      res.json({ success: true, message: '支付宝配置格式校验通过' });
    } else { res.status(400).json({ success: false, error: '未知渠道' }); }
  } catch (err) { res.json({ success: false, error: err.message }); }
});

// Order timeout cleanup (every 5 min)
setInterval(() => {
  try {
    const timeout = parseInt(db.prepare("SELECT value FROM settings WHERE key = 'orderTimeout'")?.get()?.value || '30');
    const cutoff = new Date(Date.now() - timeout * 60000).toISOString();
    const r = db.prepare("UPDATE orders SET status = 'expired' WHERE status = 'pending' AND created_at < ?").run(cutoff);
    if (r.changes > 0) console.log('[PAY] 清理过期订单: ' + r.changes + ' 个');
  } catch (e) {}
}, 5 * 60 * 1000);

// ========== ADMIN ==========
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) return res.status(401).json({ error: '账号或密码错误' });
  const token = jwt.sign({ id: admin.id, username: admin.username, isAdmin: true }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, admin: { username: admin.username, role: admin.role } });
});

app.get('/api/admin/stats', adminAuth, (req, res) => {
  const totalUsers = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  const todayUsers = db.prepare("SELECT COUNT(*) as c FROM users WHERE date(created_at) = date('now')").get().c;
  const totalRecords = db.prepare('SELECT COUNT(*) as c FROM records').get().c;
  const todayRecords = db.prepare("SELECT COUNT(*) as c FROM records WHERE date(created_at) = date('now')").get().c;
  const totalRevenue = db.prepare("SELECT COALESCE(SUM(amount), 0) as c FROM orders WHERE status = 'paid'").get().c;
  const todayRevenue = db.prepare("SELECT COALESCE(SUM(amount), 0) as c FROM orders WHERE status = 'paid' AND date(pay_time) = date('now')").get().c;
  const recentRecords = db.prepare('SELECT r.*, u.username FROM records r LEFT JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC LIMIT 10').all();
  const typeStats = db.prepare('SELECT type, COUNT(*) as count FROM records GROUP BY type ORDER BY count DESC').all();
  const vipUsers = db.prepare('SELECT COUNT(*) as c FROM users WHERE is_vip = 1').get().c;
  const totalOrders = db.prepare('SELECT COUNT(*) as c FROM orders').get().c;
  const paidOrders = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'paid'").get().c;

  // Daily traffic for last 7 days
  const dailyTraffic = db.prepare(`
    SELECT date(created_at) as day, COUNT(*) as requests, COUNT(DISTINCT ip) as unique_ips
    FROM api_logs WHERE created_at >= date('now', '-7 days')
    GROUP BY date(created_at) ORDER BY day
  `).all();

  // Top endpoints
  const topEndpoints = db.prepare(`
    SELECT path, COUNT(*) as count FROM api_logs
    WHERE created_at >= date('now', '-7 days')
    GROUP BY path ORDER BY count DESC LIMIT 10
  `).all();

  // Hourly distribution today
  const hourlyTraffic = db.prepare(`
    SELECT strftime('%H', created_at) as hour, COUNT(*) as count
    FROM api_logs WHERE date(created_at) = date('now')
    GROUP BY hour ORDER BY hour
  `).all();

  res.json({
    totalUsers, todayUsers, totalRecords, todayRecords, totalRevenue, todayRevenue,
    recentRecords, typeStats, vipUsers, totalOrders, paidOrders,
    dailyTraffic, topEndpoints, hourlyTraffic,
    aiEnabled: engine.getAIConfig().enabled,
    aiModel: engine.getAIConfig().model
  });
});

app.get('/api/admin/users', adminAuth, (req, res) => {
  const page = parseInt(req.query.page) || 1; const limit = parseInt(req.query.limit) || 20; const search = req.query.search || '';
  const offset = (page - 1) * limit;
  let where = 'WHERE 1=1'; const params = [];
  if (search) { where += ' AND (username LIKE ? OR nickname LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  const total = db.prepare(`SELECT COUNT(*) as c FROM users ${where}`).get(...params).c;
  const users = db.prepare(`SELECT id, username, nickname, is_vip, vip_expire, points, created_at FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);
  res.json({ users, total });
});

app.delete('/api/admin/users/:id', adminAuth, (req, res) => {
  db.prepare('DELETE FROM records WHERE user_id = ?').run(req.params.id);
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.put('/api/admin/users/:id/vip', adminAuth, (req, res) => {
  const { isVip } = req.body;
  db.prepare('UPDATE users SET is_vip = ?, vip_expire = ? WHERE id = ?').run(isVip ? 1 : 0, isVip ? new Date(Date.now() + 365 * 86400000).toISOString() : null, req.params.id);
  res.json({ success: true });
});

app.get('/api/admin/records', adminAuth, (req, res) => {
  const page = parseInt(req.query.page) || 1; const limit = parseInt(req.query.limit) || 20; const type = req.query.type || '';
  const offset = (page - 1) * limit;
  let where = 'WHERE 1=1'; const params = [];
  if (type) { where += ' AND r.type = ?'; params.push(type); }
  const total = db.prepare(`SELECT COUNT(*) as c FROM records r ${where}`).get(...params).c;
  const records = db.prepare(`SELECT r.*, u.username FROM records r LEFT JOIN users u ON r.user_id = u.id ${where} ORDER BY r.created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);
  res.json({ records, total });
});

app.delete('/api/admin/records/:id', adminAuth, (req, res) => {
  db.prepare('DELETE FROM records WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/admin/orders', adminAuth, (req, res) => {
  const page = parseInt(req.query.page) || 1; const limit = parseInt(req.query.limit) || 20; const status = req.query.status || '';
  const offset = (page - 1) * limit;
  let where = 'WHERE 1=1'; const params = [];
  if (status) { where += ' AND o.status = ?'; params.push(status); }
  const total = db.prepare(`SELECT COUNT(*) as c FROM orders o ${where}`).get(...params).c;
  const orders = db.prepare(`SELECT o.*, u.username FROM orders o LEFT JOIN users u ON o.user_id = u.id ${where} ORDER BY o.created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);
  res.json({ orders, total });
});

app.put('/api/admin/orders/:id/refund', adminAuth, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: '订单不存在' });
  db.prepare("UPDATE orders SET status = 'refunded', refund_time = datetime('now') WHERE id = ?").run(req.params.id);
  if (order.product === 'vip_month' || order.product === 'vip_year') {
    db.prepare("UPDATE users SET is_vip = 0, vip_expire = NULL WHERE id = ?").run(order.user_id);
  }
  res.json({ success: true });
});

app.get('/api/admin/settings', adminAuth, (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const settings = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  res.json(settings);
});

app.put('/api/admin/settings', adminAuth, (req, res) => {
  const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  const entries = Object.entries(req.body);
  const tx = db.transaction(() => { entries.forEach(([k, v]) => { if (v !== undefined && v !== null) upsert.run(k, String(v)); }); });
  tx();
  res.json({ success: true });
});

// Test AI connection
app.post('/api/admin/ai/test', adminAuth, async (req, res) => {
  try {
    const reply = await engine.callAI('你是一个测试助手', '请回复"连接成功"两个字', 50);
    if (reply) {
      res.json({ success: true, reply, model: engine.getAIConfig().model });
    } else {
      res.json({ success: false, error: 'AI未返回有效响应，请检查API Key和模型配置' });
    }
  } catch(e) {
    res.json({ success: false, error: e.message });
  }
});

// Health
app.get('/api/health', (req, res) => { res.json({ status: 'ok', timestamp: new Date().toISOString() }); });

// Catch-all
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });


app.listen(PORT, '0.0.0.0', () => { console.log('Divination server running on port ' + PORT); });
