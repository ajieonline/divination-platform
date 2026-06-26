"""Complete 12 zodiac signs data with Chinese names, personality traits, compatibilities."""

ZODIAC_SIGNS = [
    {
        "sign_name": "Aries",
        "sign_name_cn": "白羊座",
        "date_range": "3月21日 - 4月19日",
        "element": "火",
        "ruling_planet": "火星",
        "personality_traits": "热情、勇敢、直率、冲动、有领导力、行动派",
        "strengths": "积极主动、有勇气、乐观向上、坦诚直率、有冒险精神",
        "weaknesses": "急躁、冲动、缺乏耐心、自我中心、容易放弃",
        "compatible_signs": "狮子座、射手座、双子座、水瓶座",
        "lucky_numbers": "1, 8, 17",
        "lucky_colors": "红色、橙色"
    },
    {
        "sign_name": "Taurus",
        "sign_name_cn": "金牛座",
        "date_range": "4月20日 - 5月20日",
        "element": "土",
        "ruling_planet": "金星",
        "personality_traits": "稳重、务实、忠诚、固执、享受生活、有耐心",
        "strengths": "踏实可靠、有毅力、忠诚专一、懂得享受生活、有品味",
        "weaknesses": "固执己见、占有欲强、变化缓慢、物质主义、抗拒改变",
        "compatible_signs": "处女座、摩羯座、巨蟹座、双鱼座",
        "lucky_numbers": "2, 6, 9",
        "lucky_colors": "绿色、粉色"
    },
    {
        "sign_name": "Gemini",
        "sign_name_cn": "双子座",
        "date_range": "5月21日 - 6月21日",
        "element": "风",
        "ruling_planet": "水星",
        "personality_traits": "聪明、机智、多变、好奇、健谈、有双面性",
        "strengths": "思维敏捷、善于沟通、适应力强、多才多艺、幽默风趣",
        "weaknesses": "善变、浮躁、缺乏专注、表面化、容易紧张",
        "compatible_signs": "天秤座、水瓶座、白羊座、狮子座",
        "lucky_numbers": "5, 7, 14",
        "lucky_colors": "黄色、银色"
    },
    {
        "sign_name": "Cancer",
        "sign_name_cn": "巨蟹座",
        "date_range": "6月22日 - 7月22日",
        "element": "水",
        "ruling_planet": "月亮",
        "personality_traits": "敏感、体贴、顾家、情绪化、有同理心、保护欲强",
        "strengths": "善解人意、重视家庭、直觉敏锐、有爱心、记忆力好",
        "weaknesses": "情绪多变、过于敏感、逃避现实、依赖性强、记仇",
        "compatible_signs": "天蝎座、双鱼座、金牛座、处女座",
        "lucky_numbers": "2, 7, 11",
        "lucky_colors": "银色、白色"
    },
    {
        "sign_name": "Leo",
        "sign_name_cn": "狮子座",
        "date_range": "7月23日 - 8月22日",
        "element": "火",
        "ruling_planet": "太阳",
        "personality_traits": "自信、热情、慷慨、骄傲、有领导力、爱表现",
        "strengths": "自信大方、有魅力、热情开朗、忠诚可靠、有创造力",
        "weaknesses": "自负、虚荣、专横、需要关注、不善倾听",
        "compatible_signs": "白羊座、射手座、双子座、天秤座",
        "lucky_numbers": "1, 3, 10",
        "lucky_colors": "金色、橙色"
    },
    {
        "sign_name": "Virgo",
        "sign_name_cn": "处女座",
        "date_range": "8月23日 - 9月22日",
        "element": "土",
        "ruling_planet": "水星",
        "personality_traits": "细心、完美主义、理性、务实、有分析力、追求完美",
        "strengths": "注重细节、有条理、勤奋努力、可靠踏实、善于分析",
        "weaknesses": "过于挑剔、焦虑、批判性强、缺乏自信、过度工作",
        "compatible_signs": "金牛座、摩羯座、巨蟹座、天蝎座",
        "lucky_numbers": "5, 14, 23",
        "lucky_colors": "灰色、米色"
    },
    {
        "sign_name": "Libra",
        "sign_name_cn": "天秤座",
        "date_range": "9月23日 - 10月23日",
        "element": "风",
        "ruling_planet": "金星",
        "personality_traits": "优雅、和谐、公正、犹豫不决、有艺术感、社交能力强",
        "strengths": "善于平衡、有品味、社交能力强、公正客观、有艺术天赋",
        "weaknesses": "优柔寡断、回避冲突、依赖他人、虚荣、表面化",
        "compatible_signs": "双子座、水瓶座、狮子座、射手座",
        "lucky_numbers": "6, 9, 15",
        "lucky_colors": "粉色、蓝色"
    },
    {
        "sign_name": "Scorpio",
        "sign_name_cn": "天蝎座",
        "date_range": "10月24日 - 11月22日",
        "element": "水",
        "ruling_planet": "冥王星",
        "personality_traits": "神秘、热情、执着、洞察力强、有控制欲、爱恨分明",
        "strengths": "意志力强、有洞察力、忠诚专一、有魅力、善于隐藏",
        "weaknesses": "多疑嫉妒、报复心强、控制欲强、不善妥协、神秘莫测",
        "compatible_signs": "巨蟹座、双鱼座、处女座、摩羯座",
        "lucky_numbers": "8, 11, 18",
        "lucky_colors": "深红色、黑色"
    },
    {
        "sign_name": "Sagittarius",
        "sign_name_cn": "射手座",
        "date_range": "11月23日 - 12月21日",
        "element": "火",
        "ruling_planet": "木星",
        "personality_traits": "乐观、自由、冒险、直率、爱旅行、有哲学思想",
        "strengths": "乐观开朗、热爱自由、有冒险精神、诚实直率、有智慧",
        "weaknesses": "缺乏耐心、不够细心、过度理想化、鲁莽、不善承诺",
        "compatible_signs": "白羊座、狮子座、天秤座、水瓶座",
        "lucky_numbers": "3, 9, 21",
        "lucky_colors": "紫色、蓝色"
    },
    {
        "sign_name": "Capricorn",
        "sign_name_cn": "摩羯座",
        "date_range": "12月22日 - 1月19日",
        "element": "土",
        "ruling_planet": "土星",
        "personality_traits": "稳重、务实、有野心、自律、保守、有责任感",
        "strengths": "有责任心、意志坚强、组织能力强、稳重可靠、有远见",
        "weaknesses": "过于严肃、功利主义、缺乏变通、不善表达情感、固执",
        "compatible_signs": "金牛座、处女座、天蝎座、双鱼座",
        "lucky_numbers": "4, 8, 13",
        "lucky_colors": "棕色、黑色"
    },
    {
        "sign_name": "Aquarius",
        "sign_name_cn": "水瓶座",
        "date_range": "1月20日 - 2月18日",
        "element": "风",
        "ruling_planet": "天王星",
        "personality_traits": "独立、创新、人道主义、叛逆、有理想、思想前卫",
        "strengths": "有创意、独立自主、人道主义、思想开放、有远见",
        "weaknesses": "叛逆固执、情感疏离、不善表达、理想主义、不合群",
        "compatible_signs": "双子座、天秤座、白羊座、射手座",
        "lucky_numbers": "4, 7, 11",
        "lucky_colors": "蓝色、银色"
    },
    {
        "sign_name": "Pisces",
        "sign_name_cn": "双鱼座",
        "date_range": "2月19日 - 3月20日",
        "element": "水",
        "ruling_planet": "海王星",
        "personality_traits": "浪漫、敏感、有同理心、梦幻、有艺术天赋、直觉强",
        "strengths": "富有同情心、有艺术天赋、直觉敏锐、温柔善良、有想象力",
        "weaknesses": "逃避现实、容易受影响、优柔寡断、缺乏自信、爱做梦",
        "compatible_signs": "巨蟹座、天蝎座、金牛座、摩羯座",
        "lucky_numbers": "3, 7, 12",
        "lucky_colors": "海蓝色、紫色"
    }
]


def get_zodiac_by_name(name: str) -> dict:
    """Get zodiac data by English or Chinese name."""
    name_lower = name.lower()
    for zodiac in ZODIAC_SIGNS:
        if (zodiac["sign_name"].lower() == name_lower or
            zodiac["sign_name_cn"] == name):
            return zodiac
    return None


def get_all_zodiac_signs() -> list:
    """Return all zodiac signs."""
    return ZODIAC_SIGNS
