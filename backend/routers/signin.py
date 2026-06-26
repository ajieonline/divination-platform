from fastapi import APIRouter
from datetime import date
import random

router = APIRouter(prefix="/api/signin", tags=["signin"])

FORTUNES = [
    {"rank":"大吉","text":"春风化雨，万事如意","color":"#d4af37","poem":"紫气东来福满门，财源广进喜临身"},
    {"rank":"中吉","text":"雨后初晴，渐入佳境","color":"#7c3aed","poem":"守得云开见月明，前方道路尽光明"},
    {"rank":"小吉","text":"细水长流，稳步前行","color":"#3b82f6","poem":"千里之行始于足下，积跬步以至千里"},
    {"rank":"末吉","text":"静待时机，厚积薄发","color":"#10b981","poem":"梅花香自苦寒来，宝剑锋从磨砺出"},
    {"rank":"小凶","text":"谨慎行事，三思后行","color":"#6b7280","poem":"退一步海阔天空，忍一时风平浪静"},
]

ADVICE = ["今日宜：学习、阅读、冥想","今日宜：社交、合作、沟通","今日忌：冲动消费、熬夜","幸运方位：正南","幸运数字：3、7、9","今日穿搭：金色或紫色饰品增运"]

@router.post("/check-in")
async def check_in():
    fortune = random.choice(FORTUNES)
    lucky_advice = random.sample(ADVICE, 2)
    return {
        "date": str(date.today()),
        "fortune": fortune,
        "lucky_advice": lucky_advice,
        "streak": random.randint(1, 30),
        "points_earned": random.randint(5, 20),
        "message": f"签到成功！获得{random.randint(5,20)}积分，今日运势：{fortune['rank']}"
    }

@router.get("/status")
async def signin_status():
    return {"today_signed": random.choice([True, False]), "streak": random.randint(0, 15), "total_signins": random.randint(5, 100), "points": random.randint(50, 500)}
