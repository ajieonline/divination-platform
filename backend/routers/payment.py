from fastapi import APIRouter

router = APIRouter(prefix="/api/membership", tags=["membership"])

PLANS = [
    {"id": "free", "name": "免费版", "price": 0, "features": ["每日3次占卜", "基础塔罗解读", "每日星座运势"]},
    {"id": "monthly", "name": "月度VIP", "price": 19.9, "features": ["无限次占卜", "深度AI解读", "全部占卜功能", "专属签到奖励", "无广告"]},
    {"id": "yearly", "name": "年度VIP", "price": 168, "features": ["无限次占卜", "深度AI解读", "全部占卜功能", "专属签到奖励", "无广告", "优先体验新功能", "个性化报告"]},
]

@router.get("/plans")
async def get_plans():
    return {"plans": PLANS}

@router.post("/subscribe")
async def subscribe(plan_id: str):
    return {"success": True, "message": f"订阅{plan_id}成功", "plan": plan_id}
