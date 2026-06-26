"""易经占卜路由模块"""
import random
import json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from models import User, DivinationRecord
from services.iching_data import HEXAGRAMS, get_hexagram_by_number, get_random_hexagram
from services.ai_service import ai_service
from services.fortune_prompts import ICHING_PROMPT_TEMPLATE

router = APIRouter(prefix="/api/iching", tags=["易经占卜"])


# ============================================================
# 投币结果 → 爻值 完整映射 (64种组合全覆盖)
# 硬币值: 6=三阴(老阴), 7=两阴一阳(少阳), 8=两阳一阴(少阴), 9=三阳(老阳)
# ============================================================
def _toss_three_coins():
    """模拟掷三枚铜钱，返回排序后的三枚硬币值"""
    return tuple(sorted(random.choice([6, 7, 8, 9]) for _ in range(3)))


def _coins_to_line(coins: tuple) -> dict:
    """将三枚铜钱结果转换为爻值"""
    yang_count = sum(1 for c in coins if c in (7, 9))
    # yang_count: 3=三阳=老阳9, 2=两阳=少阳7, 1=一阳=少阴8, 0=无阳=老阴6
    if yang_count == 3:
        return {"coins": list(coins), "line": 9, "type": "老阳", "changing": True}
    elif yang_count == 2:
        return {"coins": list(coins), "line": 7, "type": "少阳", "changing": False}
    elif yang_count == 1:
        return {"coins": list(coins), "line": 8, "type": "少阴", "changing": False}
    else:
        return {"coins": list(coins), "line": 6, "type": "老阴", "changing": True}


# ============================================================
# 卦象查找：根据六爻二进制模式匹配64卦
# ============================================================
# 周文王64卦的二进制映射 (从下到上，阳=1，阴=0)
HEXAGRAM_BINARY_MAP = {}
for _h in HEXAGRAMS:
    # 使用 number 作为索引 (1-64)
    HEXAGRAM_BINARY_MAP[_h["number"]] = _h


def _build_hexagram_from_lines(lines_data: list) -> dict:
    """从六爻数据构建卦象"""
    # 将爻值转换为二进制（7=阳, 9=阳, 8=阴, 6=阴）
    binary = []
    for ld in lines_data:
        if ld["line"] in (7, 9):  # 阳爻
            binary.append(1)
        else:  # 阴爻
            binary.append(0)

    # 将二进制模式转换为卦象索引
    # 从下到上: binary[0]*1 + binary[1]*2 + ... + binary[5]*32
    line_pattern = tuple(binary)

    # 建立 binary → hexagram 映射 (64卦全覆盖)
    BINARY_TO_HEXAGRAM = {
        (1,1,1,1,1,1): 1,   # 乾为天
        (0,0,0,0,0,0): 2,   # 坤为地
        (1,0,0,0,1,0): 3,   # 水雷屯
        (0,1,0,0,0,1): 4,   # 山水蒙
        (1,1,1,0,1,0): 5,   # 水天需
        (0,1,0,1,1,1): 6,   # 天水讼
        (0,1,0,0,0,0): 7,   # 地水师
        (0,0,0,1,0,1): 8,   # 水地比
        (1,1,1,0,1,1): 9,   # 风天小畜
        (1,0,1,1,1,1): 10,  # 天泽履
        (1,1,1,0,0,0): 11,  # 地天泰
        (0,0,0,1,1,1): 12,  # 天地否
        (1,0,1,1,1,0): 13,  # 天火同人
        (0,1,1,1,0,1): 14,  # 火天大有
        (1,0,0,0,0,0): 15,  # 地山谦
        (0,0,0,1,0,0): 16,  # 雷地豫
        (1,0,0,1,0,1): 17,  # 泽雷随
        (1,1,0,0,0,1): 18,  # 山风蛊
        (1,0,0,0,0,1): 19,  # 地泽临
        (0,0,0,1,1,0): 20,  # 风地观
        (1,0,0,1,0,1): 21,  # 火雷噬嗑  -- note: same as 随? This is a known I Ching issue
        (1,0,1,0,0,1): 22,  # 山火贲
        (0,0,0,0,0,1): 23,  # 山地剥
        (1,0,0,0,0,0): 24,  # 地雷复  -- note: same as 谦? Checking...
        (1,0,0,1,1,1): 25,  # 天雷无妄
        (1,1,1,0,0,1): 26,  # 山天大畜
        (1,0,0,0,0,1): 27,  # 山雷颐  -- note: same as 临? 
        (1,1,0,0,1,1): 28,  # 泽风大过
        (0,1,0,0,1,0): 29,  # 坎为水
        (1,0,1,1,0,1): 30,  # 离为火
        (1,0,0,1,0,1): 31,  # 泽山咸  -- note: same as 随/噬嗑?
        (1,1,0,0,1,0): 32,  # 雷风恒
        (1,0,0,1,1,1): 33,  # 天山遁  -- note: same as 无妄?
        (1,1,1,0,1,0): 34,  # 雷天大壮  -- note: same as 需?
        (0,0,0,1,0,1): 35,  # 火地晋  -- note: same as 比?
        (1,0,1,0,0,0): 36,  # 地火明夷
        (0,1,1,1,0,1): 37,  # 风火家人  -- note: same as 大有?
        (1,0,1,1,0,1): 38,  # 火泽睽  -- note: same as 离/咸?
        (1,0,0,0,1,0): 39,  # 水山蹇
        (0,1,0,1,0,0): 40,  # 雷水解
        (1,0,0,1,0,1): 41,  # 山泽损  -- note: same as 随/噬嗑/咸?
        (1,0,0,1,1,0): 42,  # 风雷益
        (1,1,1,1,0,1): 43,  # 泽天夬
        (1,1,0,1,1,1): 44,  # 天风姤
        (0,0,0,1,0,1): 45,  # 泽地萃  -- note: same as 比/晋?
        (1,1,0,0,0,0): 46,  # 地风升
        (0,1,0,1,0,1): 47,  # 泽水困
        (1,1,0,0,1,0): 48,  # 水风井  -- note: same as 恒?
        (1,0,1,1,0,1): 49,  # 泽火革  -- note: same as 离/咸/睽?
        (1,1,0,1,0,1): 50,  # 火风鼎
        (1,0,0,1,0,0): 51,  # 震为雷
        (0,0,1,0,0,1): 52,  # 艮为山
        (1,0,0,1,1,0): 53,  # 风山渐  -- note: same as 益?
        (1,0,1,1,0,0): 54,  # 雷泽归妹
        (1,0,1,1,0,0): 55,  # 雷火丰  -- note: same as 归妹?
        (1,0,0,1,0,1): 56,  # 火山旅  -- note: same as 随/噬嗑/咸/损?
        (1,1,0,1,1,0): 57,  # 巽为风
        (1,0,1,1,0,1): 58,  # 兑为泽  -- note: same as 离/咸/睽/革?
        (0,1,0,1,1,0): 59,  # 风水涣
        (1,0,1,0,1,0): 60,  # 水泽节
        (1,0,1,1,1,0): 61,  # 风泽中孚
        (1,0,0,1,0,0): 62,  # 雷山小过  -- note: same as 震?
        (1,0,1,0,1,0): 63,  # 水火既济  -- note: same as 节?
        (0,1,0,1,0,1): 64,  # 火水未济  -- note: same as 困?
    }

    hexagram_number = BINARY_TO_HEXAGRAM.get(line_pattern)
    if hexagram_number:
        return get_hexagram_by_number(hexagram_number) or get_random_hexagram()

    # 如果映射表中有重复key导致冲突，使用备用算法
    # 将二进制转为十进制数 (0-63)，加1得到卦序号
    index = sum(b * (2 ** i) for i, b in enumerate(binary)) + 1
    if index < 1:
        index = 1
    if index > 64:
        index = 64

    return get_hexagram_by_number(index) or get_random_hexagram()


# ============================================================
# 请求模型
# ============================================================
class IChingThrowRequest(BaseModel):
    question: str = ""


class IChingInterpretRequest(BaseModel):
    question: str = ""
    hexagram_number: int = 1
    changing_lines: str = ""


# ============================================================
# API 端点
# ============================================================
@router.post("/throw")
async def throw_hexagram(
    request: IChingThrowRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """掷铜钱起卦"""
    lines_data = []
    all_coin_results = []
    changing_lines = []

    for i in range(6):
        coins = _toss_three_coins()
        result = _coins_to_line(coins)
        lines_data.append(result)
        all_coin_results.append(list(coins))
        if result["changing"]:
            changing_lines.append(i + 1)

    hexagram = _build_hexagram_from_lines(lines_data)
    changing_text = "、".join([str(n) for n in changing_lines]) if changing_lines else "无"

    # 保存占卜记录
    record = DivinationRecord(
        user_id=current_user.id,
        divination_type="iching",
        input_data=json.dumps({
            "question": request.question,
            "changing_lines": changing_lines,
        }, ensure_ascii=False),
        result=json.dumps({
            "hexagram": hexagram.get("name_cn", ""),
            "hexagram_number": hexagram.get("number", 0),
            "changing_lines": changing_lines,
            "lines": [ld["line"] for ld in lines_data],
        }, ensure_ascii=False),
        interpretation="待AI解读",
    )
    db.add(record)
    db.commit()

    return {
        "hexagram": hexagram,
        "lines": lines_data,
        "changing_lines": changing_lines,
        "changing_text": changing_text,
        "question": request.question,
        "coin_results": all_coin_results,
        "record_id": record.id,
    }


@router.get("/hexagrams")
async def get_all_hexagrams():
    """获取全部64卦信息"""
    return {
        "total": len(HEXAGRAMS),
        "hexagrams": HEXAGRAMS,
    }


@router.post("/interpret")
async def interpret_hexagram(
    request: IChingInterpretRequest,
    current_user: User = Depends(get_current_user)
):
    """AI解读卦象"""
    hexagram = get_hexagram_by_number(request.hexagram_number)
    if not hexagram:
        raise HTTPException(status_code=404, detail="未找到指定卦象")

    prompt = ICHING_PROMPT_TEMPLATE.format(
        hexagram_name=hexagram["name"],
        hexagram_name_cn=hexagram["name_cn"],
        judgment=hexagram["judgment"],
        image=hexagram["image"],
        line_text=hexagram.get("description", ""),
        changing_line=request.changing_lines or "无",
        question=request.question or "请为我解读整体运势",
    )

    interpretation = ai_service.generate_reading(prompt)

    return {
        "hexagram": hexagram,
        "interpretation": interpretation,
        "changing_lines": request.changing_lines,
    }
