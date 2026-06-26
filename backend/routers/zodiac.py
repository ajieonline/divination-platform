"""星座运势路由模块"""
import random
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from models import User
from services.zodiac_data import get_zodiac_by_name, get_all_zodiac_signs
from services.ai_service import ai_service
from services.fortune_prompts import (
    ZODIAC_DAILY_PROMPT, ZODIAC_WEEKLY_PROMPT, ZODIAC_MONTHLY_PROMPT
)

router = APIRouter(prefix="/api/zodiac", tags=["星座运势"])

# 幸运元素池
LUCKY_COLORS = ["红色", "蓝色", "绿色", "紫色", "金色", "银色", "粉色", "橙色", "白色", "黑色",
                "黄色", "天蓝色", "深红色", "咖啡色", "翡翠绿", "玫瑰金"]
LUCKY_DIRECTIONS = ["东", "南", "西", "北", "东南", "东北", "西南", "西北"]


def _generate_fortune_scores():
    """生成随机运势分数"""
    return {
        "love": random.randint(30, 100),
        "career": random.randint(30, 100),
        "wealth": random.randint(30, 100),
        "health": random.randint(30, 100),
    }


@router.get("/{sign}/fortune")
async def get_zodiac_fortune(
    sign: str,
    period: str = Query("daily", regex="^(daily|weekly|monthly)$"),
    current_user: User = Depends(get_current_user),
):
    """获取星座运势"""
    zodiac = get_zodiac_by_name(sign)
    if not zodiac:
        raise HTTPException(status_code=404, detail=f"未找到星座: {sign}")

    scores = _generate_fortune_scores()
    overall = round((scores["love"] + scores["career"] + scores["wealth"] + scores["health"]) / 4)

    prompt_map = {
        "daily": ZODIAC_DAILY_PROMPT,
        "weekly": ZODIAC_WEEKLY_PROMPT,
        "monthly": ZODIAC_MONTHLY_PROMPT,
    }

    prompt = prompt_map[period].format(
        sign_name=zodiac["sign_name"],
        sign_name_cn=zodiac["sign_name_cn"],
        date_range=zodiac["date_range"],
        element=zodiac["element"],
        ruling_planet=zodiac["ruling_planet"],
        month=datetime.now().strftime("%Y年%m月"),
    )

    fortune_text = ai_service.generate_reading(prompt)

    result = {
        "sign_name": zodiac["sign_name"],
        "sign_name_cn": zodiac["sign_name_cn"],
        "period": period,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "scores": {
            "love": scores["love"],
            "career": scores["career"],
            "wealth": scores["wealth"],
            "health": scores["health"],
            "overall": overall,
        },
        "lucky_color": random.choice(LUCKY_COLORS),
        "lucky_number": random.randint(1, 99),
        "lucky_direction": random.choice(LUCKY_DIRECTIONS),
        "fortune_text": fortune_text,
        "compatible_signs": zodiac["compatible_signs"],
    }

    return result
