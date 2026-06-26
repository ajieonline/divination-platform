from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/user", tags=["user"])

@router.get("/profile")
async def get_profile():
    return {"id": 1, "username": "灵境用户", "email": "user@lingjing.com", "avatar": "", "membership": "free", "points": 280, "total_divinations": 42, "streak_days": 7, "created_at": "2024-01-01"}

@router.get("/history")
async def get_history():
    return {"records": [
        {"id": 1, "type": "tarot", "title": "塔罗牌占卜", "summary": "命运之轮正位 — 转机将至", "date": "2024-03-15"},
        {"id": 2, "type": "zodiac", "title": "星座运势", "summary": "天蝎座今日综合运势：85分", "date": "2024-03-14"},
        {"id": 3, "type": "bazi", "title": "八字命理", "summary": "命格：水木相生，才华横溢", "date": "2024-03-13"},
        {"id": 4, "type": "iching", "title": "周易占卜", "summary": "乾卦 — 天行健，君子以自强不息", "date": "2024-03-12"},
    ]}

class FavoriteRequest(BaseModel):
    type: str
    title: str
    content: str

@router.post("/favorite")
async def add_favorite(req: FavoriteRequest):
    return {"success": True, "message": "收藏成功"}

@router.get("/favorites")
async def get_favorites():
    return {"favorites": [
        {"id": 1, "type": "tarot", "title": "命运之轮", "date": "2024-03-15"},
        {"id": 2, "type": "dream", "title": "飞翔之梦解读", "date": "2024-03-10"},
    ]}
