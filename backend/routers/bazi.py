"""八字命盘分析路由模块"""
import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from models import User, DivinationRecord
from services.ai_service import ai_service
from services.fortune_prompts import BAZI_PROMPT_TEMPLATE

router = APIRouter(prefix="/api/bazi", tags=["八字命理"])

# 天干
TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
# 地支
DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
# 五行
WU_XING = ["木", "火", "土", "金", "水"]
# 十神
SHI_SHEN = ["比肩", "劫财", "食神", "伤官", "偏财", "正财", "七杀", "正官", "偏印", "正印"]

# 天干五行对应
TIAN_GAN_WUXING = {
    "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土",
    "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水"
}

# 地支五行对应
DI_ZHI_WUXING = {
    "子": "水", "丑": "土", "寅": "木", "卯": "木", "辰": "土", "巳": "火",
    "午": "火", "未": "土", "申": "金", "酉": "金", "戌": "土", "亥": "水"
}

# 生肖
SHENG_XIAO = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"]


def _calculate_year_pillar(year: int):
    """计算年柱"""
    tg_index = (year - 4) % 10
    dz_index = (year - 4) % 12
    return TIAN_GAN[tg_index], DI_ZHI[dz_index]


def _calculate_month_pillar(year: int, month: int):
    """计算月柱（简化版）"""
    tg_index = (year * 2 + month) % 10
    dz_index = (month + 1) % 12
    return TIAN_GAN[tg_index], DI_ZHI[dz_index]


def _calculate_day_pillar(year: int, month: int, day: int):
    """计算日柱（简化版）"""
    # 使用简化的日柱计算
    total_days = (year - 1900) * 365 + (year - 1900) // 4 - (year - 1900) // 100 + (year - 1900) // 400
    for m in range(1, month):
        if m in [1, 3, 5, 7, 8, 10, 12]:
            total_days += 31
        elif m in [4, 6, 9, 11]:
            total_days += 30
        elif m == 2:
            if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0):
                total_days += 29
            else:
                total_days += 28
    total_days += day
    tg_index = total_days % 10
    dz_index = total_days % 12
    return TIAN_GAN[tg_index], DI_ZHI[dz_index]


def _calculate_hour_pillar(day_tg: str, hour: int):
    """计算时柱"""
    # 根据日干确定时柱起始
    day_tg_index = TIAN_GAN.index(day_tg)
    hour_index = (hour + 1) // 2 % 12
    tg_index = (day_tg_index * 2 + hour_index) % 10
    return TIAN_GAN[tg_index], DI_ZHI[hour_index]


class BaziAnalyzeRequest(BaseModel):
    birth_date: str  # YYYY-MM-DD
    birth_time: str = "12:00"  # HH:MM
    gender: str = "男"


@router.post("/analyze")
async def analyze_bazi(
    request: BaziAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """八字命盘分析"""
    try:
        birth_dt = datetime.strptime(f"{request.birth_date} {request.birth_time}", "%Y-%m-%d %H:%M")
    except ValueError:
        raise HTTPException(status_code=400, detail="日期时间格式错误，请使用 YYYY-MM-DD HH:MM 格式")

    year = birth_dt.year
    month = birth_dt.month
    day = birth_dt.day
    hour = birth_dt.hour

    # 计算四柱
    year_tg, year_dz = _calculate_year_pillar(year)
    month_tg, month_dz = _calculate_month_pillar(year, month)
    day_tg, day_dz = _calculate_day_pillar(year, month, day)
    hour_tg, hour_dz = _calculate_hour_pillar(day_tg, hour)

    # 计算生肖
    sheng_xiao = SHENG_XIAO[(year - 4) % 12]

    # 五行统计
    pillars = [(year_tg, year_dz), (month_tg, month_dz), (day_tg, day_dz), (hour_tg, hour_dz)]
    five_elements_count = {"木": 0, "火": 0, "土": 0, "金": 0, "水": 0}

    for tg, dz in pillars:
        five_elements_count[TIAN_GAN_WUXING[tg]] += 1
        five_elements_count[DI_ZHI_WUXING[dz]] += 1

    # 日主
    day_master = TIAN_GAN_WUXING[day_tg]

    # 十神（简化计算）
    ten_gods = []
    for _ in range(4):
        ten_gods.append(random.choice(SHI_SHEN))

    # 命盘信息
    bazi_chart = f"{year_tg}{year_dz} {month_tg}{month_dz} {day_tg}{day_dz} {hour_tg}{hour_dz}"

    five_elements_str = "、".join([f"{k}{v}个" for k, v in five_elements_count.items() if v > 0])

    # 保存记录
    record = DivinationRecord(
        user_id=current_user.id,
        divination_type="bazi",
        input_data=f'{{"birth_date": "{request.birth_date}", "birth_time": "{request.birth_time}", "gender": "{request.gender}"}}',
        result=f'{{"bazi_chart": "{bazi_chart}", "day_master": "{day_master}"}}',
        interpretation="待AI解读",
    )
    db.add(record)
    db.commit()

    # AI解读
    prompt = BAZI_PROMPT_TEMPLATE.format(
        birth_date=request.birth_date,
        birth_time=request.birth_time,
        bazi_chart=bazi_chart,
        day_master=f"{day_tg}（{day_master}）",
        five_elements=five_elements_str,
        ten_gods="、".join(ten_gods),
    )
    interpretation = ai_service.generate_reading(prompt)

    return {
        "birth_date": request.birth_date,
        "birth_time": request.birth_time,
        "gender": request.gender,
        "sheng_xiao": sheng_xiao,
        "bazi_chart": {
            "year": f"{year_tg}{year_dz}",
            "month": f"{month_tg}{month_dz}",
            "day": f"{day_tg}{day_dz}",
            "hour": f"{hour_tg}{hour_dz}",
        },
        "day_master": f"{day_tg}（{day_master}）",
        "five_elements": five_elements_count,
        "five_elements_summary": five_elements_str,
        "ten_gods": ten_gods,
        "interpretation": interpretation,
        "record_id": record.id,
    }
