// AI inference helper — reads config from settings table
const https = require('https');
const http = require('http');
const Database = require('better-sqlite3');
const db = new Database('/data/divination.db');

function getAIConfig() {
  try {
    const rows = db.prepare("SELECT key, value FROM settings WHERE key IN ('ai_base_url','ai_api_key','ai_model','ai_enabled')").all();
    const cfg = {};
    rows.forEach(r => { cfg[r.key] = r.value; });
    return {
      enabled: cfg.ai_enabled === 'true',
      baseUrl: cfg.ai_base_url || 'https://api.openai.com',
      apiKey: cfg.ai_api_key || '',
      model: cfg.ai_model || 'gpt-4o-mini'
    };
  } catch(e) {
    return { enabled: false, baseUrl: '', apiKey: '', model: '' };
  }
}

async function callAI(systemPrompt, userPrompt, maxTokens = 800) {
  const cfg = getAIConfig();
  if (!cfg.enabled || !cfg.apiKey) return null;

  const base = cfg.baseUrl.replace(/\/+$/, '');
  const apiPath = base.endsWith('/v1') ? base : base + '/v1';
  const url = new URL(apiPath + '/chat/completions');
  const transport = url.protocol === 'https:' ? https : http;

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: cfg.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.8
    });

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cfg.apiKey,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 30000
    };

    const req = transport.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.choices && json.choices[0]) {
            const content = json.choices[0].message.content || json.choices[0].message.reasoning_content || null;
            resolve(content);
          } else {
            resolve(null);
          }
        } catch(e) { resolve(null); }
      });
    });

    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.write(postData);
    req.end();
  });
}

// ========== TAROT DATA ==========
const tarotMajor = [
  { id: 0, name: '愚者', nameEn: 'The Fool', image: '🃏', meaning: '新的开始、冒险、自由', reversed: '鲁莽、不计后果、犹豫不决' },
  { id: 1, name: '魔术师', nameEn: 'The Magician', image: '🎩', meaning: '创造力、技能、意志力', reversed: '欺骗、操纵、能力不足' },
  { id: 2, name: '女祭司', nameEn: 'The High Priestess', image: '🌙', meaning: '直觉、神秘、内在智慧', reversed: '忽视直觉、表面化、秘密' },
  { id: 3, name: '女皇', nameEn: 'The Empress', image: '👑', meaning: '丰收、母性、自然', reversed: '依赖、过度放纵、创造力匮乏' },
  { id: 4, name: '皇帝', nameEn: 'The Emperor', image: '🏛️', meaning: '权威、稳定、领导力', reversed: '专横、僵化、控制欲' },
  { id: 5, name: '教皇', nameEn: 'The Hierophant', image: '⛪', meaning: '传统、信仰、教育', reversed: '打破常规、挑战权威' },
  { id: 6, name: '恋人', nameEn: 'The Lovers', image: '💕', meaning: '爱情、和谐、选择', reversed: '不和谐、错误选择、分离' },
  { id: 7, name: '战车', nameEn: 'The Chariot', image: '🏎️', meaning: '胜利、意志力、决心', reversed: '失去方向、缺乏控制、挫败' },
  { id: 8, name: '力量', nameEn: 'Strength', image: '🦁', meaning: '勇气、耐心、内在力量', reversed: '自我怀疑、软弱、缺乏自信' },
  { id: 9, name: '隐士', nameEn: 'The Hermit', image: '🧙', meaning: '内省、孤独、寻求智慧', reversed: '孤立、逃避、固执' },
  { id: 10, name: '命运之轮', nameEn: 'Wheel of Fortune', image: '🎡', meaning: '转变、命运、周期', reversed: '抗拒改变、厄运、停滞' },
  { id: 11, name: '正义', nameEn: 'Justice', image: '⚖️', meaning: '公正、真相、因果', reversed: '不公、偏见、逃避责任' },
  { id: 12, name: '倒吊人', nameEn: 'The Hanged Man', image: '🔄', meaning: '牺牲、等待、新视角', reversed: '拖延、无谓牺牲、抗拒' },
  { id: 13, name: '死神', nameEn: 'Death', image: '💀', meaning: '结束、转变、重生', reversed: '抗拒改变、恐惧、停滞不前' },
  { id: 14, name: '节制', nameEn: 'Temperance', image: '🏺', meaning: '平衡、耐心、中庸', reversed: '失衡、过度、缺乏耐心' },
  { id: 15, name: '恶魔', nameEn: 'The Devil', image: '😈', meaning: '诱惑、束缚、物质', reversed: '解脱、释放、重获自由' },
  { id: 16, name: '塔', nameEn: 'The Tower', image: '🗼', meaning: '突变、破坏、觉醒', reversed: '避免灾难、内在变革' },
  { id: 17, name: '星星', nameEn: 'The Star', image: '⭐', meaning: '希望、灵感、宁静', reversed: '失望、缺乏信心、孤独' },
  { id: 18, name: '月亮', nameEn: 'The Moon', image: '🌕', meaning: '幻觉、恐惧、潜意识', reversed: '克服恐惧、真相显现' },
  { id: 19, name: '太阳', nameEn: 'The Sun', image: '☀️', meaning: '快乐、成功、活力', reversed: '暂时挫败、过度乐观' },
  { id: 20, name: '审判', nameEn: 'Judgement', image: '📯', meaning: '觉醒、审视、复活', reversed: '自我怀疑、拒绝反思' },
  { id: 21, name: '世界', nameEn: 'The World', image: '🌍', meaning: '完成、成就、圆满', reversed: '未完成、缺乏终结、遗憾' }
];

const suits = {
  cups: { name: '圣杯', element: '水', emoji: '🏆', cards: [
    { id: 1, name: '圣杯一', meaning: '新感情、直觉、爱的开始', reversed: '情感空虚、爱情受挫' },
    { id: 2, name: '圣杯二', meaning: '和谐、伙伴关系、相互吸引', reversed: '失衡、分离、沟通不畅' },
    { id: 3, name: '圣杯三', meaning: '友谊、庆祝、社交', reversed: '孤立、过度放纵、不忠' },
    { id: 4, name: '圣杯四', meaning: '冥想、不满、新机会', reversed: '行动力、把握机会、觉醒' },
    { id: 5, name: '圣杯五', meaning: '失望、悲伤、遗憾', reversed: '接受、放下、重新出发' },
    { id: 6, name: '圣杯六', meaning: '回忆、怀旧、纯真', reversed: '活在当下、释放过去' },
    { id: 7, name: '圣杯七', meaning: '幻想、选择、诱惑', reversed: '清醒、做出选择、面对现实' },
    { id: 8, name: '圣杯八', meaning: '放弃、追寻、离开', reversed: '逃避、犹豫不决' },
    { id: 9, name: '圣杯九', meaning: '满足、幸福、愿望成真', reversed: '不满足、物质主义' },
    { id: 10, name: '圣杯十', meaning: '家庭幸福、和谐、圆满', reversed: '家庭矛盾、不和谐' },
    { id: 11, name: '圣杯侍从', meaning: '浪漫消息、直觉、创意', reversed: '不成熟、情绪化' },
    { id: 12, name: '圣杯骑士', meaning: '浪漫追求、魅力、温柔', reversed: '情绪失控、不切实际' },
    { id: 13, name: '圣杯王后', meaning: '同情心、直觉、温暖', reversed: '依赖、情绪操控' },
    { id: 14, name: '圣杯国王', meaning: '情感成熟、领导力、智慧', reversed: '情感压抑、控制欲' }
  ]},
  swords: { name: '宝剑', element: '风', emoji: '⚔️', cards: [
    { id: 1, name: '宝剑一', meaning: '真相、突破、新思维', reversed: '混乱、误解、破坏力' },
    { id: 2, name: '宝剑二', meaning: '僵局、回避、内心挣扎', reversed: '释放、突破、做出决定' },
    { id: 3, name: '宝剑三', meaning: '心碎、悲伤、分离', reversed: '治愈、释放、原谅' },
    { id: 4, name: '宝剑四', meaning: '休息、恢复、冥想', reversed: '躁动、不耐烦、疲惫' },
    { id: 5, name: '宝剑五', meaning: '冲突、失败、自私', reversed: '和解、接受失败、公平' },
    { id: 6, name: '宝剑六', meaning: '过渡、前进、离开', reversed: '停滞、无法放下、纠结' },
    { id: 7, name: '宝剑七', meaning: '策略、独行、秘密', reversed: '坦白、面对真相、坦诚' },
    { id: 8, name: '宝剑八', meaning: '限制、无力感、被困', reversed: '释放、突破、自由' },
    { id: 9, name: '宝剑九', meaning: '焦虑、噩梦、失眠', reversed: '释放恐惧、希望' },
    { id: 10, name: '宝剑十', meaning: '终结、背叛、痛苦', reversed: '重生、新开始、恢复' },
    { id: 11, name: '宝剑侍从', meaning: '好奇心、警觉、新想法', reversed: '鲁莽、不成熟' },
    { id: 12, name: '宝剑骑士', meaning: '行动、果断、冲突', reversed: '鲁莽、破坏性、冲动' },
    { id: 13, name: '宝剑王后', meaning: '独立、清晰、直率', reversed: '冷漠、尖酸刻薄' },
    { id: 14, name: '宝剑国王', meaning: '权威、公正、理性', reversed: '操纵、不公正、冷酷' }
  ]},
  wands: { name: '权杖', element: '火', emoji: '🪄', cards: [
    { id: 1, name: '权杖一', meaning: '灵感、新行动、创造力', reversed: '延误、缺乏方向' },
    { id: 2, name: '权杖二', meaning: '规划、决定、远见', reversed: '犹豫、缺乏方向' },
    { id: 3, name: '权杖三', meaning: '扩展、领导、远见', reversed: '延迟、挫折' },
    { id: 4, name: '权杖四', meaning: '庆祝、和谐、家庭', reversed: '不安定、缺乏支持' },
    { id: 5, name: '权杖五', meaning: '竞争、冲突、挑战', reversed: '避免冲突、内在平静' },
    { id: 6, name: '权杖六', meaning: '胜利、认可、自信', reversed: '自负、缺乏认可' },
    { id: 7, name: '权杖七', meaning: '勇气、坚定、防御', reversed: '放弃、缺乏勇气' },
    { id: 8, name: '权杖八', meaning: '行动、速度、变化', reversed: '延误、混乱' },
    { id: 9, name: '权杖九', meaning: '坚韧、坚持、防御', reversed: '疲惫、偏执' },
    { id: 10, name: '权杖十', meaning: '负担、责任、压力', reversed: '释放、减负' },
    { id: 11, name: '权杖侍从', meaning: '热情、探索、冒险', reversed: '不成熟、方向不明' },
    { id: 12, name: '权杖骑士', meaning: '冒险、热情、行动', reversed: '冲动、鲁莽' },
    { id: 13, name: '权杖王后', meaning: '热情、独立、温暖', reversed: '嫉妒、控制欲' },
    { id: 14, name: '权杖国王', meaning: '领导力、远见、自信', reversed: '独裁、冲动' }
  ]},
  pentacles: { name: '星币', element: '土', emoji: '💰', cards: [
    { id: 1, name: '星币一', meaning: '财富、机会、新开始', reversed: '错失机会、财务损失' },
    { id: 2, name: '星币二', meaning: '平衡、适应、多任务', reversed: '失衡、过度分散' },
    { id: 3, name: '星币三', meaning: '合作、技能、工艺', reversed: '缺乏团队精神、平庸' },
    { id: 4, name: '星币四', meaning: '安全、保守、控制', reversed: '贪婪、吝啬、过度控制' },
    { id: 5, name: '星币五', meaning: '贫困、困难、孤立', reversed: '恢复、好转、希望' },
    { id: 6, name: '星币六', meaning: '慷慨、分享、平衡', reversed: '不公平、债务' },
    { id: 7, name: '星币七', meaning: '耐心、等待、收获', reversed: '缺乏耐心、过度投入' },
    { id: 8, name: '星币八', meaning: '勤奋、技能、专注', reversed: '缺乏动力、走捷径' },
    { id: 9, name: '星币九', meaning: '独立、富足、自我价值', reversed: '依赖、物质主义' },
    { id: 10, name: '星币十', meaning: '家庭财富、传承、稳定', reversed: '家庭问题、财务损失' },
    { id: 11, name: '星币侍从', meaning: '学习、新技能、机会', reversed: '不成熟、缺乏方向' },
    { id: 12, name: '星币骑士', meaning: '勤奋、可靠、安全', reversed: '懒惰、缺乏目标' },
    { id: 13, name: '星币王后', meaning: '富足、务实、安全', reversed: '过度物质化、嫉妒' },
    { id: 14, name: '星币国王', meaning: '财富、领导力、稳定', reversed: '贪婪、控制欲' }
  ]}
};

function drawTarotCards(spread, question) {
  const allCards = [];
  // Add major arcana
  tarotMajor.forEach(c => allCards.push({ ...c, type: 'major' }));
  // Add minor arcana
  Object.entries(suits).forEach(([suitKey, suit]) => {
    suit.cards.forEach(c => allCards.push({ ...c, suit: suit.name, suitKey, type: 'minor' }));
  });
  
  // Shuffle
  for (let i = allCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
  }

  const spreads = {
    single: [{ position: '核心牌' }],
    three: [{ position: '过去' }, { position: '现在' }, { position: '未来' }],
    celtic: [{ position: '现状' }, { position: '挑战' }, { position: '根基' }, { position: '过去' }, { position: '可能' }, { position: '近期' }, { position: '自我' }, { position: '环境' }, { position: '希望' }, { position: '结果' }]
  };

  const positions = spreads[spread] || spreads.single;
  const drawn = positions.map((pos, i) => {
    const card = allCards[i];
    const reversed = Math.random() < 0.3;
    return {
      ...card,
      position: pos.position,
      reversed,
      fullName: card.name + (card.suit ? '·' + card.suit : ''),
      reading: reversed ? card.reversed : card.meaning
    };
  });

  return drawn;
}

// ========== ZODIAC DATA ==========
const zodiacData = {
  '白羊座': { symbol: '♈', dates: '3/21-4/19', element: '火', planet: '火星', personality: '热情、冲动、勇敢、直率', love: '追求激情和新鲜感', career: '适合创业和领导岗位', luckyColor: '红色', luckyNumber: '9' },
  '金牛座': { symbol: '♉', dates: '4/20-5/20', element: '土', planet: '金星', personality: '稳重、踏实、耐心、享受生活', love: '忠诚可靠的伴侣', career: '适合金融、艺术、美食', luckyColor: '绿色', luckyNumber: '6' },
  '双子座': { symbol: '♊', dates: '5/21-6/21', element: '风', planet: '水星', personality: '聪明、多变、好奇、社交', love: '需要精神交流', career: '适合媒体、教育、销售', luckyColor: '黄色', luckyNumber: '5' },
  '巨蟹座': { symbol: '♋', dates: '6/22-7/22', element: '水', planet: '月亮', personality: '温柔、敏感、顾家、有同理心', love: '重视家庭和安全感', career: '适合护理、教育、餐饮', luckyColor: '银色', luckyNumber: '2' },
  '狮子座': { symbol: '♌', dates: '7/23-8/22', element: '火', planet: '太阳', personality: '自信、大方、有领导力、热情', love: '需要被崇拜和欣赏', career: '适合管理、演艺、公关', luckyColor: '金色', luckyNumber: '1' },
  '处女座': { symbol: '♍', dates: '8/23-9/22', element: '土', planet: '水星', personality: '细致、完美主义、务实、聪明', love: '需要稳定的伴侣关系', career: '适合分析、医疗、编辑', luckyColor: '灰色', luckyNumber: '7' },
  '天秤座': { symbol: '♎', dates: '9/23-10/23', element: '风', planet: '金星', personality: '优雅、平衡、追求和谐、社交', love: '重视浪漫和平等', career: '适合外交、设计、法律', luckyColor: '粉色', luckyNumber: '8' },
  '天蝎座': { symbol: '♏', dates: '10/24-11/22', element: '水', planet: '冥王星', personality: '神秘、洞察力强、意志坚定、深情', love: '全心投入、占有欲强', career: '适合研究、心理、金融', luckyColor: '深红', luckyNumber: '0' },
  '射手座': { symbol: '♐', dates: '11/23-12/21', element: '火', planet: '木星', personality: '乐观、自由、冒险、哲学', love: '需要自由空间', career: '适合旅行、教育、哲学', luckyColor: '紫色', luckyNumber: '3' },
  '摩羯座': { symbol: '♑', dates: '12/22-1/19', element: '土', planet: '土星', personality: '务实、有责任心、有野心、坚毅', love: '慢热但忠诚', career: '适合管理、工程、金融', luckyColor: '黑色', luckyNumber: '4' },
  '水瓶座': { symbol: '♒', dates: '1/20-2/18', element: '风', planet: '天王星', personality: '独立、创新、博爱、独特', love: '需要精神伴侣', career: '适合科技、人道主义、艺术', luckyColor: '蓝色', luckyNumber: '11' },
  '双鱼座': { symbol: '♓', dates: '2/19-3/20', element: '水', planet: '海王星', personality: '浪漫、敏感、有同情心、艺术', love: '理想主义的恋爱', career: '适合艺术、音乐、心理', luckyColor: '海蓝', luckyNumber: '10' }
};

function getZodiac(month, day) {
  const dates = [
    [1, 20, '摩羯座'], [2, 19, '水瓶座'], [3, 21, '白羊座'],
    [4, 20, '金牛座'], [5, 21, '双子座'], [6, 22, '巨蟹座'],
    [7, 23, '狮子座'], [8, 23, '处女座'], [9, 23, '天秤座'],
    [10, 24, '天蝎座'], [11, 23, '射手座'], [12, 22, '摩羯座']
  ];
  const m = parseInt(month), d = parseInt(day);
  for (let i = dates.length - 1; i >= 0; i--) {
    if (m === dates[i][0] && d >= dates[i][1]) return dates[i][2];
    if (m === dates[i][0] + 1 && d < dates[(i + 1) % 12][1]) return dates[i][2];
  }
  return '摩羯座';
}

function generateDailyFortune(zodiac) {
  const data = zodiacData[zodiac] || zodiacData['白羊座'];
  const fortunes = ['大吉', '吉', '中吉', '小吉', '平'];
  const luck = fortunes[Math.floor(Math.random() * fortunes.length)];
  const luckScoreMap = { '大吉': 5, '吉': 4, '中吉': 4, '小吉': 3, '平': 3 };
  const baseScore = luckScoreMap[luck] || 3;
  const aspectScore = (offset) => Math.max(1, Math.min(5, baseScore + offset));
  return {
    zodiac, symbol: data.symbol, element: data.element,
    luck, luckScore: baseScore,
    loveScore: aspectScore(0),
    careerScore: aspectScore(1),
    wealthScore: aspectScore(-1),
    healthScore: aspectScore(0),
    overall: `${zodiac}今日运势${luck}。${data.personality}的你今天适合关注内心感受。`,
    love: `感情方面：${data.love}。今天适合表达真实感受。`,
    career: `事业方面：${data.career}。今天可能有新的机会出现。`,
    wealth: `财富方面：适合稳健规划，先确认现金流与长期目标。`,
    health: `健康方面：留意作息节奏，给自己安排一段不被打扰的恢复时间。`,
    luckyColor: data.luckyColor, luckyNumber: data.luckyNumber,
    luckyDirection: '东方',
    advice: '把最重要的决定拆成可验证的小步骤，今天更适合稳中求进。'
  };
}

// ========== EIGHT CHARACTERS ==========
function getEightCharacters(year, month, day, hour) {
  const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const yearIdx = (year - 4) % 10;
  const monthIdx = (year * 2 + month) % 12;
  const dayIdx = (year + month + day) % 10;
  const hourIdx = hour % 12;
  const yP = tianGan[yearIdx] + diZhi[yearIdx];
  const mP = tianGan[(monthIdx) % 10] + diZhi[monthIdx % 12];
  const dP = tianGan[dayIdx] + diZhi[dayIdx % 12];
  const hP = tianGan[(hourIdx * 2) % 10] + diZhi[hourIdx];

  // Count wuxing from pillars
  const allPillars = yP + mP + dP + hP;
  const wuxingMap = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
    '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水' };
  const wb = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  for (const c of allPillars) { if (wuxingMap[c]) wb[wuxingMap[c]]++; }

  const pillars = [yP, mP, dP, hP];
  return {
    yearPillar: yP, monthPillar: mP, dayPillar: dP, hourPillar: hP,
    pillars,
    wuxingBalance: wb,
    wuxing: { metal: wb['金'], wood: wb['木'], water: wb['水'], fire: wb['火'], earth: wb['土'] },
    personality: '八字分析中...',
    summary: '八字命理分析完成'
  };
}

// ========== HEXAGRAM ==========
function generateHexagram(question) {
  const hexagrams = [
    { name: '乾', symbol: '☰', meaning: '天行健，君子以自强不息', interpretation: '刚健有力，适合主动进取', upper: '乾', lower: '乾' },
    { name: '坤', symbol: '☷', meaning: '地势坤，君子以厚德载物', interpretation: '柔顺包容，适合守成等待', upper: '坤', lower: '坤' },
    { name: '屯', symbol: '☵☳', meaning: '云雷屯，君子以经纶', interpretation: '万事开头难，需耐心经营', upper: '坎', lower: '震' },
    { name: '蒙', symbol: '☶☵', meaning: '山下出泉，蒙', interpretation: '启蒙教育，需虚心学习', upper: '艮', lower: '坎' },
    { name: '需', symbol: '☵☰', meaning: '云上于天，需', interpretation: '等待时机，蓄势待发', upper: '坎', lower: '乾' },
    { name: '讼', symbol: '☰☵', meaning: '天与水违行，讼', interpretation: '争讼不利，宜和解', upper: '乾', lower: '坎' },
    { name: '师', symbol: '☷☵', meaning: '地中有水，师', interpretation: '行军打仗，需有纪律', upper: '坤', lower: '坎' },
    { name: '比', symbol: '☵☷', meaning: '地上有水，比', interpretation: '亲附团结，合作共赢', upper: '坎', lower: '坤' }
  ];
  const hex = hexagrams[Math.floor(Math.random() * hexagrams.length)];
  // Generate 6 lines (0=阴爻, 1=阳爻, 2=动爻阴, 3=动爻阳)
  const lines = Array.from({ length: 6 }, (_, i) => {
    const v = Math.floor(Math.random() * 4);
    return { type: (v === 0 || v === 2) ? '阴' : '阳', changing: (v === 2 || v === 3) };
  });
  return { ...hex, lines, question };
}

// ========== NAME ANALYSIS ==========
function nameAnalysis(name, partnerName) {
  const strokes = name.split('').map((c, i) => c.charCodeAt(0) % 10 + 4);
  const total = strokes.reduce((a, b) => a + b, 0);
  const match = partnerName ? Math.floor(Math.random() * 30) + 70 : null;
  const element = ['金', '木', '水', '火', '土'][total % 5];
  const luckLevels = ['大吉', '吉', '中吉', '小吉', '末吉'];
  const luck = luckLevels[total % 5];
  return {
    name, strokes: strokes.join('-'), totalStrokes: total,
    element, wuxing: element, luck,
    personality: `性格沉稳，思维敏捷，善于交际，有领导才能。五行属${element}，做事踏实有毅力。`,
    fiveGrid: { heaven: total + 1, human: total + 3, earth: total - 1 },
    partnerName: partnerName || null,
    matchScore: match,
    analysis: `「${name}」这个名字${match ? (match > 85 ? '与另一半非常契合' : '与另一半需要更多磨合') : '蕴含着独特的能量'}。总笔画数${total}，五行属${element}。`
  };
}

// (old signs object removed - using array format below)


// ========== DREAM INTERPRETATION ==========
function interpretDream(keyword) {
  const dreamDict = {
    '水': { symbol: '水代表情感与潜意识', fortune: '近期情感丰富，内心世界活跃', element: '水' },
    '火': { symbol: '火代表激情与变革', fortune: '事业上可能有突破，注意控制情绪', element: '火' },
    '蛇': { symbol: '蛇代表智慧与转变', fortune: '可能面临重要选择，需要谨慎决策', element: '木' },
    '鱼': { symbol: '鱼代表财富与机遇', fortune: '财运较好，可能有意外收获', element: '水' },
    '飞': { symbol: '飞翔代表自由与超越', fortune: '渴望突破现状，事业发展空间大', element: '金' },
    '跌': { symbol: '跌落代表失控与不安', fortune: '注意身体健康，避免冲动决策', element: '土' },
    '门': { symbol: '门代表机遇与选择', fortune: '新的机会即将出现，要把握时机', element: '木' },
    '花': { symbol: '花代表美好与短暂', fortune: '享受当下美好，珍惜身边人', element: '木' },
    '月': { symbol: '月亮代表直觉与变化', fortune: '跟随内心直觉，变化中寻找平衡', element: '水' },
    '考试': { symbol: '考试代表考验与成长', fortune: '面临考验但能顺利通过', element: '金' },
    '结婚': { symbol: '结婚代表结合与承诺', fortune: '人际关系和谐，可能有好消息', element: '火' },
    '钱': { symbol: '金钱代表价值与资源', fortune: '关注财务规划，理性消费', element: '金' },
    '猫': { symbol: '猫代表独立与灵性', fortune: '保持独立思考，相信直觉', element: '木' },
    '狗': { symbol: '狗代表忠诚与友谊', fortune: '珍惜朋友关系，互相支持', element: '土' },
    '树': { symbol: '树代表成长与稳定', fortune: '根基稳固，持续成长中', element: '木' },
    '天空': { symbol: '天空代表广阔与可能', fortune: '视野开阔，志向远大', element: '金' },
    '大海': { symbol: '大海代表深邃与包容', fortune: '内心丰富，包容力强', element: '水' },
    '山': { symbol: '山代表稳固与障碍', fortune: '面对挑战需耐心，终将克服', element: '土' },
    '雨': { symbol: '雨代表洗涤与新生', fortune: '新的开始，过去的烦恼将消散', element: '水' }
  };
  const lower = keyword.trim();
  const matched = dreamDict[lower] || dreamDict[Object.keys(dreamDict).find(k => lower.includes(k))] || null;
  if (matched) {
    return { ...matched, keyword: lower };
  }
  // Default fallback
  return {
    keyword: lower,
    symbol: '梦境反映了内心的深层想法',
    fortune: '近期运势平稳，保持积极心态',
    element: '综合'
  };
}

// ========== SIGNS (抽签) ==========
const signs = [
  { title: '上上签·紫微星', poem: '紫微高照满天星，锦绣前程任你行', meaning: '大吉大利，万事如意', lucky: '上上', emoji: '⭐' },
  { title: '上签·春风化雨', poem: '春风化雨润心田，柳暗花明又一村', meaning: '困难将过去，好运转来', lucky: '上', emoji: '🌸' },
  { title: '中上签·月明中天', poem: '月明中天照四方，清风徐来水波凉', meaning: '平稳发展，渐入佳境', lucky: '中上', emoji: '🌟' },
  { title: '中签·守株待兔', poem: '静待时机莫急躁，守得云开见月明', meaning: '耐心等待，时机未到', lucky: '中', emoji: '🎲' },
  { title: '中下签·秋风落叶', poem: '秋风萧瑟天气凉，落叶飘零意彷徨', meaning: '暂时低谷，蓄力待发', lucky: '中下', emoji: '🍂' },
  { title: '下签·乌云遮日', poem: '乌云遮日天不明，行路艰难需谨慎', meaning: '近期多注意，小心行事', lucky: '下', emoji: '🌧️' },
  { title: '上签·鲤鱼跃龙门', poem: '鲤鱼跃过龙门去，化龙腾飞上九天', meaning: '有突破机会，要把握', lucky: '上', emoji: '🐟' },
  { title: '中上签·鸿运当头', poem: '鸿运当头喜气扬，贵人相助福满堂', meaning: '有贵人运，适合社交', lucky: '中上', emoji: '🔮' }
];

module.exports = { getAIConfig, callAI, drawTarotCards, zodiacData, getZodiac, generateDailyFortune, getEightCharacters, generateHexagram, nameAnalysis, interpretDream, signs };
