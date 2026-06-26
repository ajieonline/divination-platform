-- ═══════════════════════════════════════════════════════════════
-- 灵境占卜 (Divination Platform) — Database Initialization
-- ═══════════════════════════════════════════════════════════════

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════════
-- Users & Authentication
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username        VARCHAR(50)  UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    display_name    VARCHAR(100),
    avatar_url      TEXT,
    birth_date      DATE,
    zodiac_sign     VARCHAR(20),
    is_active       BOOLEAN DEFAULT TRUE,
    is_premium      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- ═══════════════════════════════════════════════════════════════
-- Divination Types
-- ═══════════════════════════════════════════════════════════════

CREATE TYPE divination_type AS ENUM (
    'tarot',        -- 塔罗牌
    'astrology',    -- 星盘占卜
    'bazi',         -- 八字命理
    'zodiac',       -- 星座运势
    'palmistry',    -- 手相
    'i_ching',      -- 易经
    'tea_leaf',     -- 茶叶占卜
    'crystal_ball', -- 水晶球
    'numerology'    -- 数字命理
);

-- ═══════════════════════════════════════════════════════════════
-- Tarot Card System
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS tarot_cards (
    id              SERIAL PRIMARY KEY,
    name_cn         VARCHAR(100) NOT NULL,
    name_en         VARCHAR(100) NOT NULL,
    arcana          VARCHAR(10) NOT NULL CHECK (arcana IN ('major', 'minor')),
    suit            VARCHAR(20),
    number          INTEGER,
    image_url       TEXT,
    upright_meaning    TEXT,
    reversed_meaning   TEXT,
    keywords_upright   TEXT[],
    keywords_reversed  TEXT[],
    description        TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tarot_spreads (
    id              SERIAL PRIMARY KEY,
    name_cn         VARCHAR(100) NOT NULL,
    name_en         VARCHAR(100) NOT NULL,
    description     TEXT,
    position_count  INTEGER NOT NULL CHECK (position_count > 0),
    position_names  TEXT[],
    is_premium      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- Divination Sessions (User Readings)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS divination_sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    divination_type divination_type NOT NULL,
    spread_id       INTEGER REFERENCES tarot_spreads(id),
    question        TEXT NOT NULL,
    ai_interpretation TEXT,
    user_notes      TEXT,
    is_public       BOOLEAN DEFAULT FALSE,
    rating          INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON divination_sessions(user_id);
CREATE INDEX idx_sessions_type ON divination_sessions(divination_type);
CREATE INDEX idx_sessions_created ON divination_sessions(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- Session Card Positions (for tarot readings)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS session_cards (
    id              SERIAL PRIMARY KEY,
    session_id      UUID REFERENCES divination_sessions(id) ON DELETE CASCADE,
    card_id         INTEGER REFERENCES tarot_cards(id),
    position_index  INTEGER NOT NULL,
    position_name   VARCHAR(100),
    is_reversed     BOOLEAN DEFAULT FALSE,
    ai_meaning      TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_session_cards_session ON session_cards(session_id);

-- ═══════════════════════════════════════════════════════════════
-- Horoscope / Daily Fortune
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS daily_fortunes (
    id              SERIAL PRIMARY KEY,
    zodiac_sign     VARCHAR(20) NOT NULL,
    fortune_date    DATE NOT NULL,
    love_score      INTEGER CHECK (love_score >= 1 AND love_score <= 5),
    career_score    INTEGER CHECK (career_score >= 1 AND career_score <= 5),
    wealth_score    INTEGER CHECK (wealth_score >= 1 AND wealth_score <= 5),
    health_score    INTEGER CHECK (health_score >= 1 AND health_score <= 5),
    overall_score   NUMERIC(3,1),
    summary_cn      TEXT,
    lucky_color     VARCHAR(20),
    lucky_number    INTEGER,
    advice          TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(zodiac_sign, fortune_date)
);

CREATE INDEX idx_fortunes_date ON daily_fortunes(fortune_date DESC);
CREATE INDEX idx_fortunes_zodiac ON daily_fortunes(zodiac_sign);

-- ═══════════════════════════════════════════════════════════════
-- Bazi (Eight Characters) Data
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS bazi_readings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id      UUID REFERENCES divination_sessions(id) ON DELETE CASCADE,
    birth_year      INTEGER NOT NULL,
    birth_month     INTEGER NOT NULL,
    birth_day       INTEGER NOT NULL,
    birth_hour      INTEGER,
    birth_minute    INTEGER,
    gender          VARCHAR(10),
    year_pillar     VARCHAR(10),
    month_pillar    VARCHAR(10),
    day_pillar      VARCHAR(10),
    hour_pillar     VARCHAR(10),
    five_elements   JSONB,
    analysis        TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- User Favorites & History
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_favorites (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id      UUID REFERENCES divination_sessions(id) ON DELETE CASCADE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, session_id)
);

-- ═══════════════════════════════════════════════════════════════
-- Seed Data: Tarot Major Arcana (22 cards)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO tarot_cards (name_cn, name_en, arcana, number, upright_meaning, reversed_meaning, keywords_upright, keywords_reversed) VALUES
('愚者',     'The Fool',          'major', 0,  '新的开始、冒险、天真无邪',        '鲁莽、不计后果、犹豫不决',           ARRAY['开始','冒险','自由'], ARRAY['鲁莽','恐惧','停滞']),
('魔术师',   'The Magician',      'major', 1,  '创造力、意志力、技能',            '欺骗、才能被浪费',                   ARRAY['创造','意志','技能'], ARRAY['欺骗','操纵','浪费']),
('女祭司',   'The High Priestess','major', 2,  '直觉、潜意识、内在智慧',          '忽略直觉、秘密被揭露',               ARRAY['直觉','神秘','智慧'], ARRAY['忽视','隐藏','困惑']),
('女皇',     'The Empress',       'major', 3,  '丰饶、母性、创造力',              '依赖、过度放纵',                     ARRAY['丰饶','美丽','自然'], ARRAY['依赖','过度','停滞']),
('皇帝',     'The Emperor',       'major', 4,  '权威、领导力、结构',              '专制、僵化、控制欲',                 ARRAY['权威','稳定','领导'], ARRAY['专制','僵化','控制']),
('教皇',     'The Hierophant',    'major', 5,  '传统、精神指引、信仰',            '教条主义、打破常规',                 ARRAY['传统','信仰','指引'], ARRAY['教条','叛逆','打破']),
('恋人',     'The Lovers',        'major', 6,  '爱情、和谐、选择',                '不和谐、价值观冲突',                 ARRAY['爱情','选择','和谐'], ARRAY['不和','冲突','失衡']),
('战车',     'The Chariot',       'major', 7,  '胜利、决心、行动',                '失控、方向迷失',                     ARRAY['胜利','决心','行动'], ARRAY['失控','迷失','犹豫']),
('力量',     'Strength',          'major', 8,  '内在力量、勇气、耐心',            '自我怀疑、软弱',                     ARRAY['力量','勇气','耐心'], ARRAY['软弱','怀疑','急躁']),
('隐士',     'The Hermit',        'major', 9,  '内省、独处、寻求真理',            '孤立、逃避现实',                     ARRAY['内省','智慧','独处'], ARRAY['孤立','逃避','封闭']),
('命运之轮', 'Wheel of Fortune',  'major', 10, '命运转折、循环、好运',            '逆境、抗拒变化',                     ARRAY['命运','转折','好运'], ARRAY['逆境','抗拒','停滞']),
('正义',     'Justice',           'major', 11, '公正、平衡、真相',                '不公正、逃避责任',                   ARRAY['公正','平衡','真相'], ARRAY['不公','逃避','偏见']),
('倒吊人',   'The Hanged Man',    'major', 12, '放下、新视角、等待',              '拖延、固执、无谓牺牲',               ARRAY['放下','视角','等待'], ARRAY['拖延','固执','无谓']),
('死神',     'Death',             'major', 13, '转变、结束、新生',                '抗拒改变、停滞不前',                 ARRAY['转变','结束','重生'], ARRAY['抗拒','停滞','恐惧']),
('节制',     'Temperance',        'major', 14, '平衡、适度、耐心',                '失衡、过度、缺乏耐心',               ARRAY['平衡','和谐','适度'], ARRAY['失衡','过度','急躁']),
('恶魔',     'The Devil',         'major', 15, '束缚、诱惑、物质',                '释放、觉醒、摆脱控制',               ARRAY['束缚','欲望','物质'], ARRAY['释放','觉醒','解脱']),
('塔',       'The Tower',         'major', 16, '突变、颠覆、启示',                '恐惧改变、灾难逃避',                 ARRAY['突变','颠覆','觉醒'], ARRAY['恐惧','逃避','抗拒']),
('星星',     'The Star',          'major', 17, '希望、灵感、宁静',                '失望、失去信心',                     ARRAY['希望','灵感','宁静'], ARRAY['失望','灰心','绝望']),
('月亮',     'The Moon',          'major', 18, '幻觉、直觉、潜意识',              '释放恐惧、真相大白',                 ARRAY['幻觉','直觉','恐惧'], ARRAY['释放','真相','清醒']),
('太阳',     'The Sun',           'major', 19, '成功、喜悦、活力',                '暂时的挫折、过度乐观',               ARRAY['成功','快乐','活力'], ARRAY['挫折','过度','自负']),
('审判',     'Judgement',         'major', 20, '觉醒、重生、反思',                '自我怀疑、拒绝成长',                 ARRAY['觉醒','重生','反思'], ARRAY['怀疑','拒绝','停滞']),
('世界',     'The World',         'major', 21, '完成、成就、圆满',                '未完成、缺乏闭合',                   ARRAY['完成','成就','圆满'], ARRAY['未完','缺失','停滞']);

-- ═══════════════════════════════════════════════════════════════
-- Seed Data: Tarot Spreads
-- ═══════════════════════════════════════════════════════════════

INSERT INTO tarot_spreads (name_cn, name_en, description, position_count, position_names) VALUES
('单牌占卜', 'Single Card',       '快速抽一张牌获取今日指引',          1, ARRAY['今日指引']),
('三牌占卜', 'Three Card',        '过去、现在、未来的牌阵',            3, ARRAY['过去','现在','未来']),
('凯尔特十字', 'Celtic Cross',   '经典十张牌牌阵，全面深入分析',      10, ARRAY['现状','挑战','根源','过去','可能','近未来','自我态度','外在影响','希望与恐惧','最终结果']),
('爱情牌阵', 'Love Spread',      '专注感情问题的五张牌阵',            5, ARRAY['你的状态','对方状态','关系基础','障碍','建议']);

-- ═══════════════════════════════════════════════════════════════
-- Update Trigger
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
