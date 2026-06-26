from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import generate_interpretation

router = APIRouter(prefix="/api/dream", tags=["dream"])

DREAM_KEYWORDS = {
    "飞翔": {"category": "自由", "meaning": "象征内心的渴望与自由，近期可能迎来突破", "advice": "把握机会，勇敢追求目标"},
    "蛇": {"category": "警示", "meaning": "代表潜在的危险或诱惑，需提高警惕", "advice": "注意身边的人际关系"},
    "考试": {"category": "压力", "meaning": "反映内心的焦虑与自我要求", "advice": "放松心态，相信自己"},
    "牙齿": {"category": "变化", "meaning": "预示生活中的变化，可能有新开始", "advice": "坦然面对变化"},
    "迷路": {"category": "迷茫", "meaning": "内心的不确定感，正在寻找方向", "advice": "静下心来思考真正想要的"},
    "水": {"category": "情感", "meaning": "代表情感的流动，清澈的水象征好运", "advice": "关注自己的情感状态"},
}

class DreamRequest(BaseModel):
    text: str

@router.post("/interpret")
async def interpret_dream(req: DreamRequest):
    for kw, info in DREAM_KEYWORDS.items():
        if kw in req.text:
            return {"dream": req.text, "category": info["category"], "meaning": info["meaning"], "advice": info["advice"], "lucky_color": "紫色", "lucky_number": 7}
    
    ai_result = await generate_interpretation(
        f"用户梦境描述：{req.text}\n请从心理学和传统文化角度解析这个梦境的含义，给出建议。",
        "dream"
    )
    return {"dream": req.text, "category": "综合", "meaning": ai_result, "advice": "保持积极心态", "lucky_color": "蓝色", "lucky_number": 3}
