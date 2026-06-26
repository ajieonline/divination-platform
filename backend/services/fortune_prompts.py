"""AI prompt templates for each divination type."""


TAROT_PROMPT_TEMPLATE = """请为以下塔罗牌占卜进行详细解读：

【抽到的牌】
{card_info}

【占卜问题】
{question}

【要求】
1. 结合牌面象征意义进行解读
2. 分析牌面对求问者的启示和指引
3. 给出具体的建议和行动方向
4. 语言温暖、专业、富有启发性
5. 解读长度200-500字

请开始解读："""


ZODIAC_DAILY_PROMPT = """请为{sign_name_cn}（{sign_name}）生成今日运势：

【星座信息】
- 星座：{sign_name_cn}（{sign_name}）
- 日期范围：{date_range}
- 元素：{element}
- 守护星：{ruling_planet}

【要求】
1. 分别从爱情运、事业运、财运、健康运四个维度解读
2. 给出今日幸运颜色、幸运数字、幸运方向
3. 提供具体的行动建议
4. 语言生动、有画面感
5. 解读长度200-500字

请开始生成今日运势："""


ZODIAC_WEEKLY_PROMPT = """请为{sign_name_cn}（{sign_name}）生成本周运势：

【星座信息】
- 星座：{sign_name_cn}（{sign_name}）
- 元素：{element}
- 守护星：{ruling_planet}

【要求】
1. 概述本周整体运势走向
2. 分别解读爱情、事业、财运、健康
3. 指出本周需要注意的事项
4. 给出每周建议
5. 解读长度300-500字

请开始生成本周运势："""


ZODIAC_MONTHLY_PROMPT = """请为{sign_name_cn}（{sign_name}）生成本月运势：

【星座信息】
- 星座：{sign_name_cn}（{sign_name}）
- 元素：{element}
- 守护星：{ruling_planet}
- 月份：{month}

【要求】
1. 概述本月整体运势大势
2. 分别解读爱情、事业、财运、健康
3. 分析本月重要星象影响
4. 给出月度建议和注意事项
5. 解读长度400-500字

请开始生成本月运势："""


ICHING_PROMPT_TEMPLATE = """请为以下易经卦象进行详细解读：

【卦象信息】
- 卦名：{hexagram_name}（{hexagram_name_cn}）
- 卦辞：{judgment}
- 象辞：{image}
- 爻辞：{line_text}
- 变爻位置：第{changing_line}爻

【占卜问题】
{question}

【要求】
1. 解释卦象的基本含义和象征
2. 分析变爻对当前问题的启示
3. 结合卦辞、象辞给出综合解读
4. 提供具体的建议和行动方向
5. 语言古朴典雅，富有哲理
6. 解读长度300-500字

请开始解读："""


BAZI_PROMPT_TEMPLATE = """请为以下八字命盘进行详细解读：

【命盘信息】
- 出生日期：{birth_date}
- 出生时间：{birth_time}
- 四柱八字：{bazi_chart}
- 日主：{day_master}
- 五行分布：{five_elements}
- 十神：{ten_gods}

【要求】
1. 分析命主的性格特征和天赋
2. 解读事业、财运、感情、健康等方面
3. 指出命局的优势和需要注意的地方
4. 给出人生建议和开运方法
5. 语言专业、详尽、有深度
6. 解读长度400-500字

请开始解读："""


MATCH_PROMPT_TEMPLATE = """请分析以下星座配对：

【配对信息】
- 星座A：{sign_a_name_cn}（{sign_a_name}）
- 星座B：{sign_b_name_cn}（{sign_b_name}）
- 配对指数：{compatibility_score}%

【星座特点】
- {sign_a_name_cn}特点：{sign_a_traits}
- {sign_b_name_cn}特点：{sign_b_traits}

【要求】
1. 分析两人的性格互补性和冲突点
2. 解读爱情配对的各个方面
3. 给出相处建议和注意事项
4. 评价配对的长期发展潜力
5. 语言生动、具体、有画面感
6. 解读长度300-500字

请开始分析："""


DREAM_PROMPT_TEMPLATE = """请解读以下梦境：

【梦境描述】
{dream_content}

【要求】
1. 分析梦境中关键元素的象征意义
2. 结合心理学和传统解梦理论
3. 探讨梦境可能反映的内心状态
4. 给出梦境对现实生活的启示
5. 提供具体的建议和指引
6. 语言温和、有深度
7. 解读长度200-400字

请开始解读："""


NAME_PROMPT_TEMPLATE = """请对以下姓名进行详细分析：

【姓名信息】
- 姓名：{name}
- 性别：{gender}
{birth_info}

【要求】
1. 分析姓名的五行属性和数理
2. 解读姓名蕴含的寓意和能量
3. 评价姓名对运势的影响
4. 分析姓名与命理的契合度
5. 提供姓名吉凶评估
6. 语言专业、详尽
7. 解读长度300-500字

请开始分析："""


SIGNIN_BONUS_PROMPT = """今日签到奖励已发放：

【签到信息】
- 连续签到天数：{streak_days}天
- 获得积分：{points}分
- 签到时间：{sign_time}

【要求】
1. 恭贺用户的坚持签到
2. 说明积分的用途
3. 鼓励用户继续保持
4. 语言温暖、有激励性
5. 解读长度50-100字

请生成签到祝福语："""
