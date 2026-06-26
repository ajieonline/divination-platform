"""Complete 78 tarot cards data: 22 Major Arcana + 56 Minor Arcana (4 suits × 14)."""

MAJOR_ARCANA = [
    {"card_number": 0, "card_name": "The Fool", "card_name_cn": "愚者", "arcana_type": "major", "suit": "",
     "upright_meaning": "新的开始、冒险、自由、天真、潜力无限",
     "reversed_meaning": "鲁莽、冒失、缺乏计划、停滞不前",
     "description": "愚者代表着新的旅程和无限可能。他轻装上阵，对未知充满好奇与期待。",
     "keywords": "开始,冒险,自由,天真"},
    {"card_number": 1, "card_name": "The Magician", "card_name_cn": "魔术师", "arcana_type": "major", "suit": "",
     "upright_meaning": "创造力、意志力、技能、自信、资源充足",
     "reversed_meaning": "操纵、欺骗、缺乏技能、方向迷失",
     "description": "魔术师象征着创造力和意志的力量。他掌握着四大元素，能将想法变为现实。",
     "keywords": "创造,意志,技能,自信"},
    {"card_number": 2, "card_name": "The High Priestess", "card_name_cn": "女祭司", "arcana_type": "major", "suit": "",
     "upright_meaning": "直觉、神秘、内在智慧、潜意识、静待时机",
     "reversed_meaning": "忽略直觉、表面化、秘密被揭露、困惑",
     "description": "女祭司代表着隐藏的知识和深层的直觉。她静坐在明暗两柱之间，守护着神秘的智慧。",
     "keywords": "直觉,神秘,智慧,潜意识"},
    {"card_number": 3, "card_name": "The Empress", "card_name_cn": "女皇", "arcana_type": "major", "suit": "",
     "upright_meaning": "丰收、母性、美丽、自然、富足",
     "reversed_meaning": "过度依赖、创造力受阻、缺乏安全感",
     "description": "女皇象征着大地之母的丰饶与滋养。她代表着生命的繁盛和美好的享受。",
     "keywords": "丰收,母性,自然,富足"},
    {"card_number": 4, "card_name": "The Emperor", "card_name_cn": "皇帝", "arcana_type": "major", "suit": "",
     "upright_meaning": "权威、结构、稳定、领导力、秩序",
     "reversed_meaning": "专制、固执、控制欲强、缺乏纪律",
     "description": "皇帝代表着世俗的权威和稳定的力量。他建立秩序，守护着他的王国。",
     "keywords": "权威,稳定,领导,秩序"},
    {"card_number": 5, "card_name": "The Hierophant", "card_name_cn": "教皇", "arcana_type": "major", "suit": "",
     "upright_meaning": "传统、信仰、教育、精神指导、道德",
     "reversed_meaning": "打破常规、叛逆、个人信仰、教条主义",
     "description": "教皇象征着传统的精神信仰和道德指引。他传授古老的智慧，引导灵魂的成长。",
     "keywords": "传统,信仰,教育,指引"},
    {"card_number": 6, "card_name": "The Lovers", "card_name_cn": "恋人", "arcana_type": "major", "suit": "",
     "upright_meaning": "爱情、和谐、选择、吸引力、关系",
     "reversed_meaning": "失衡、分离、价值观冲突、犹豫不决",
     "description": "恋人象征着爱情的结合和重要的选择。在天使的祝福下，两颗心相连。",
     "keywords": "爱情,和谐,选择,关系"},
    {"card_number": 7, "card_name": "The Chariot", "card_name_cn": "战车", "arcana_type": "major", "suit": "",
     "upright_meaning": "胜利、意志力、决心、克服困难、前进",
     "reversed_meaning": "失控、方向迷失、攻击性、挫败",
     "description": "战车象征着通过意志力和决心取得的胜利。驾驭者控制着对立的力量，勇往直前。",
     "keywords": "胜利,决心,前进,克服"},
    {"card_number": 8, "card_name": "Strength", "card_name_cn": "力量", "arcana_type": "major", "suit": "",
     "upright_meaning": "勇气、内在力量、耐心、慈悲、自我控制",
     "reversed_meaning": "软弱、自我怀疑、缺乏自信、暴力倾向",
     "description": "力量象征着内心的勇气和温柔的力量。她用爱和耐心驯服了猛狮。",
     "keywords": "勇气,力量,耐心,慈悲"},
    {"card_number": 9, "card_name": "The Hermit", "card_name_cn": "隐士", "arcana_type": "major", "suit": "",
     "upright_meaning": "内省、孤独、智慧、寻找真理、灵性",
     "reversed_meaning": "孤立、逃避、过度封闭、迷失方向",
     "description": "隐士象征着向内探索和寻找深层的智慧。他在孤独中提着灯笼，照亮内心的路。",
     "keywords": "内省,智慧,真理,灵性"},
    {"card_number": 10, "card_name": "Wheel of Fortune", "card_name_cn": "命运之轮", "arcana_type": "major", "suit": "",
     "upright_meaning": "转折、好运、命运、循环、机遇",
     "reversed_meaning": "坏运、抗拒改变、失控、厄运",
     "description": "命运之轮象征着生命的循环和命运的转折。世事无常，好运与挑战交替而来。",
     "keywords": "命运,转折,循环,机遇"},
    {"card_number": 11, "card_name": "Justice", "card_name_cn": "正义", "arcana_type": "major", "suit": "",
     "upright_meaning": "公正、真理、因果、法律、平衡",
     "reversed_meaning": "不公、偏见、逃避责任、法律纠纷",
     "description": "正义象征着宇宙的公平法则和因果报应。她手持天平与利剑，公正无私地审判一切。",
     "keywords": "公正,真理,因果,平衡"},
    {"card_number": 12, "card_name": "The Hanged Man", "card_name_cn": "倒吊人", "arcana_type": "major", "suit": "",
     "upright_meaning": "牺牲、等待、换个角度看问题、放下、顿悟",
     "reversed_meaning": "拖延、无谓的牺牲、固执己见、停滞",
     "description": "倒吊人象征着以不同的角度看世界。在悬挂中，他获得了全新的领悟。",
     "keywords": "牺牲,等待,顿悟,放下"},
    {"card_number": 13, "card_name": "Death", "card_name_cn": "死神", "arcana_type": "major", "suit": "",
     "upright_meaning": "结束、转变、重生、放下过去、新的开始",
     "reversed_meaning": "抗拒改变、停滞不前、恐惧、执着于过去",
     "description": "死神象征着旧事物的终结和新生命的诞生。不是真正的死亡，而是深刻的转变。",
     "keywords": "结束,转变,重生,放下"},
    {"card_number": 14, "card_name": "Temperance", "card_name_cn": "节制", "arcana_type": "major", "suit": "",
     "upright_meaning": "平衡、耐心、调和、中庸、和谐",
     "reversed_meaning": "失衡、过度、缺乏耐心、走极端",
     "description": "节制象征着平衡与调和的艺术。天使将水在两个杯中反复倾注，达到完美的中和。",
     "keywords": "平衡,耐心,调和,中庸"},
    {"card_number": 15, "card_name": "The Devil", "card_name_cn": "恶魔", "arcana_type": "major", "suit": "",
     "upright_meaning": "束缚、诱惑、物欲、阴暗面、依赖",
     "reversed_meaning": "解脱、释放、打破束缚、觉醒",
     "description": "恶魔象征着物质的诱惑和内心的阴暗面。被锁链束缚的人，其实可以随时挣脱。",
     "keywords": "束缚,诱惑,阴暗,依赖"},
    {"card_number": 16, "card_name": "The Tower", "card_name_cn": "塔", "arcana_type": "major", "suit": "",
     "upright_meaning": "突变、破坏、觉醒、真相揭露、重建",
     "reversed_meaning": "避免灾难、延迟改变、恐惧变化",
     "description": "塔象征着突如其来的变化和旧有结构的崩塌。虽然看似灾难，却是重建的契机。",
     "keywords": "突变,破坏,觉醒,重建"},
    {"card_number": 17, "card_name": "The Star", "card_name_cn": "星星", "arcana_type": "major", "suit": "",
     "upright_meaning": "希望、灵感、宁静、治愈、信心",
     "reversed_meaning": "失望、缺乏信心、脱离现实、绝望",
     "description": "星星象征着希望和灵性的治愈。在黑夜中，星光指引着前行的方向。",
     "keywords": "希望,灵感,宁静,治愈"},
    {"card_number": 18, "card_name": "The Moon", "card_name_cn": "月亮", "arcana_type": "major", "suit": "",
     "upright_meaning": "幻觉、潜意识、迷惑、直觉、梦境",
     "reversed_meaning": "释放恐惧、走出迷惑、清醒、真相",
     "description": "月亮象征着潜意识的深层和未知的恐惧。在月光下，现实与幻象交织。",
     "keywords": "幻觉,潜意识,迷惑,直觉"},
    {"card_number": 19, "card_name": "The Sun", "card_name_cn": "太阳", "arcana_type": "major", "suit": "",
     "upright_meaning": "成功、快乐、活力、光明、正能量",
     "reversed_meaning": "暂时的挫折、过度乐观、缺乏远见",
     "description": "太阳象征着纯粹的快乐和成功的光辉。阳光普照，万物生长。",
     "keywords": "成功,快乐,活力,光明"},
    {"card_number": 20, "card_name": "Judgement", "card_name_cn": "审判", "arcana_type": "major", "suit": "",
     "upright_meaning": "觉醒、复活、审判、反思、新的召唤",
     "reversed_meaning": "自我怀疑、逃避审视、拒绝反省",
     "description": "审判象征着灵魂的觉醒和最终的审视。天使吹响号角，亡者复活，接受最终的评判。",
     "keywords": "觉醒,复活,反思,召唤"},
    {"card_number": 21, "card_name": "The World", "card_name_cn": "世界", "arcana_type": "major", "suit": "",
     "upright_meaning": "完成、圆满、成就、旅行、和谐",
     "reversed_meaning": "未完成、停滞、缺乏闭合、逃避",
     "description": "世界象征着一个完整循环的结束和新旅程的开始。舞者被花环围绕，庆祝着圆满的成就。",
     "keywords": "完成,圆满,成就,和谐"},
]

SUIT_NAMES = {
    "wands": {"name": "Wands", "name_cn": "权杖", "element": "火"},
    "cups": {"name": "Cups", "name_cn": "圣杯", "element": "水"},
    "swords": {"name": "Swords", "name_cn": "宝剑", "element": "风"},
    "pentacles": {"name": "Pentacles", "name_cn": "星币", "element": "土"},
}

COURT_CARDS = {
    "page": {"name": "Page", "name_cn": "侍从"},
    "knight": {"name": "Knight", "name_cn": "骑士"},
    "queen": {"name": "Queen", "name_cn": "女王"},
    "king": {"name": "King", "name_cn": "国王"},
}

PIP_MEANINGS = {
    "wands": {
        "Ace": {"upright": "新机会、创造力、灵感、热情", "reversed": "延误、缺乏方向、能量不足"},
        "Two": {"upright": "规划、决策、发现方向", "reversed": "犹豫不决、缺乏计划"},
        "Three": {"upright": "领导、拓展、远见", "reversed": "挫折、延迟、缺乏远见"},
        "Four": {"upright": "稳固、奠基、庆祝", "reversed": "不稳定、缺乏基础"},
        "Five": {"upright": "竞争、冲突、挑战", "reversed": "逃避冲突、和解"},
        "Six": {"upright": "胜利、成功、认可", "reversed": "失败、不被认可"},
        "Seven": {"upright": "防御、坚持、毅力", "reversed": "放弃、疲惫、退缩"},
        "Eight": {"upright": "快速行动、进展、消息", "reversed": "延迟、焦躁、中断"},
        "Nine": {"upright": "毅力、坚韧、最后的冲刺", "reversed": "疲惫不堪、固执己见"},
        "Ten": {"upright": "负担、责任、重压", "reversed": "释放负担、解脱"},
        "Page": {"upright": "好奇、探索、新消息", "reversed": "缺乏方向、懒散"},
        "Knight": {"upright": "热情、冒险、行动力", "reversed": "冲动、鲁莽、急躁"},
        "Queen": {"upright": "热情、独立、自信", "reversed": "嫉妒、自私、情绪化"},
        "King": {"upright": "领导力、远见、企业家精神", "reversed": "独裁、暴躁、不切实际"},
    },
    "cups": {
        "Ace": {"upright": "新感情、直觉、爱的开始", "reversed": "情感封闭、拒绝爱"},
        "Two": {"upright": "伙伴关系、结合、吸引", "reversed": "失衡、分离、误解"},
        "Three": {"upright": "友谊、社交、庆祝", "reversed": "孤立、流言蜚语、过度放纵"},
        "Four": {"upright": "冥想、不满、重新审视", "reversed": "觉醒、接受新机会"},
        "Five": {"upright": "失去、悲伤、遗憾", "reversed": "恢复、接受、放下"},
        "Six": {"upright": "怀旧、纯真、美好回忆", "reversed": "沉迷过去、无法前进"},
        "Seven": {"upright": "幻想、选择、诱惑", "reversed": "清醒、做出决定"},
        "Eight": {"upright": "离开、放弃、寻找更深意义", "reversed": "犹豫、害怕改变"},
        "Nine": {"upright": "满足、幸福、愿望成真", "reversed": "不满足、贪婪、物质主义"},
        "Ten": {"upright": "家庭幸福、圆满、和谐", "reversed": "家庭矛盾、不和谐"},
        "Page": {"upright": "创意、直觉、情感消息", "reversed": "情绪不稳、不成熟"},
        "Knight": {"upright": "浪漫、魅力、理想主义", "reversed": "情绪化、不切实际"},
        "Queen": {"upright": "温柔、同情心、直觉", "reversed": "依赖、情绪操控"},
        "King": {"upright": "情感成熟、平衡、宽容", "reversed": "情绪压抑、冷漠无情"},
    },
    "swords": {
        "Ace": {"upright": "突破、清晰思维、新想法", "reversed": "混乱、误解、攻击性"},
        "Two": {"upright": "和平、平衡、内心安宁", "reversed": "失衡、冲突、内心矛盾"},
        "Three": {"upright": "心碎、悲伤、分离", "reversed": "恢复、释放悲伤"},
        "Four": {"upright": "休息、冥想、恢复", "reversed": "焦躁、无法放松"},
        "Five": {"upright": "冲突、失败、自私", "reversed": "和解、放下争端"},
        "Six": {"upright": "过渡、离开、寻求平静", "reversed": "停滞不前、无法放下"},
        "Seven": {"upright": "策略、聪明、独辟蹊径", "reversed": "失败、不诚实"},
        "Eight": {"upright": "束缚、限制、无力感", "reversed": "解脱、自由、突破"},
        "Nine": {"upright": "噩梦、焦虑、绝望", "reversed": "希望、释放恐惧"},
        "Ten": {"upright": "终结、背叛、痛苦", "reversed": "恢复、重生、放下过去"},
        "Page": {"upright": "好奇心、机智、新想法", "reversed": "刻薄、冷酷、缺乏经验"},
        "Knight": {"upright": "果断、直接、正义感", "reversed": "鲁莽、攻击性、冷酷"},
        "Queen": {"upright": "独立、清晰、公正", "reversed": "冷酷、尖刻、控制欲"},
        "King": {"upright": "智慧、公正、权威", "reversed": "操控、偏见、暴躁"},
    },
    "pentacles": {
        "Ace": {"upright": "新财务机会、繁荣、物质收获", "reversed": "错失机会、财务损失"},
        "Two": {"upright": "平衡、灵活、优先排序", "reversed": "失衡、过度分散注意力"},
        "Three": {"upright": "技艺精湛、合作、团队", "reversed": "平庸、缺乏团队合作"},
        "Four": {"upright": "安全、保守、储蓄", "reversed": "贪婪、吝啬、过度执着物质"},
        "Five": {"upright": "困难、贫穷、孤立", "reversed": "恢复、改善、接受帮助"},
        "Six": {"upright": "慷慨、分享、平衡给予与接受", "reversed": "贪婪、不公平、债务"},
        "Seven": {"upright": "耐心、长远投资、勤劳", "reversed": "缺乏耐心、短视、停滞"},
        "Eight": {"upright": "勤奋、技能提升、专注", "reversed": "无聊、缺乏动力、平庸"},
        "Nine": {"upright": "富足、独立、舒适", "reversed": "过度依赖他人、不安全感"},
        "Ten": {"upright": "财富传承、家庭繁荣、长期成功", "reversed": "家庭财务问题、继承纠纷"},
        "Page": {"upright": "学习、实用性、新财务机会", "reversed": "缺乏方向、懒惰"},
        "Knight": {"upright": "勤奋、可靠、务实", "reversed": "懒散、固执、停滞"},
        "Queen": {"upright": "丰饶、实际、关怀", "reversed": "过度执着物质、依赖他人"},
        "King": {"upright": "成功、财富、安全感", "reversed": "贪婪、过度控制、守财奴"},
    },
}

CARD_RANKS = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
              "Page", "Knight", "Queen", "King"]

ALL_CARDS = list(MAJOR_ARCANA)

card_id = 22
for suit_key, suit_info in SUIT_NAMES.items():
    for rank in CARD_RANKS:
        meanings = PIP_MEANINGS[suit_key][rank]
        rank_cn = rank
        # Map rank names to Chinese
        rank_cn_map = {
            "Ace": "A", "Two": "二", "Three": "三", "Four": "四", "Five": "五",
            "Six": "六", "Seven": "七", "Eight": "八", "Nine": "九", "Ten": "十",
        }
        if rank in rank_cn_map:
            rank_display = rank_cn_map[rank]
        else:
            rank_display = COURT_CARDS[rank.lower()]["name_cn"]

        ALL_CARDS.append({
            "card_number": card_id,
            "card_name": f"{rank} of {suit_info['name']}",
            "card_name_cn": f"{suit_info['name_cn']}{rank_display}",
            "arcana_type": "minor",
            "suit": suit_key,
            "upright_meaning": meanings["upright"],
            "reversed_meaning": meanings["reversed"],
            "description": f"此牌属于{suit_info['name_cn']}花色，象征{suit_info['element']}元素的力量。",
            "keywords": f"{suit_info['name_cn']},{rank},{suit_info['element']}",
        })
        card_id += 1


def get_all_cards() -> list:
    """Return all 78 tarot cards."""
    return ALL_CARDS


def get_card_by_number(number: int) -> dict:
    """Get a card by its number (0-77)."""
    for card in ALL_CARDS:
        if card["card_number"] == number:
            return card
    return None


def get_major_arcana() -> list:
    """Return all 22 Major Arcana cards."""
    return MAJOR_ARCANA


def get_minor_arcana() -> list:
    """Return all 56 Minor Arcana cards."""
    return [c for c in ALL_CARDS if c["arcana_type"] == "minor"]
