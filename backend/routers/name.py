from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import generate_interpretation

router = APIRouter(prefix="/api/name", tags=["name"])

WUXING_MAP = {
    "甲":"木","乙":"木","丙":"火","丁":"火","戊":"土","己":"土","庚":"金","辛":"金","壬":"水","癸":"水",
    "子":"水","丑":"土","寅":"木","卯":"木","辰":"土","巳":"火","午":"火","未":"土","申":"金","酉":"金","戌":"土","亥":"水",
}

def char_wuxing(ch):
    code = ord(ch)
    mapping = {"木":0,"火":1,"土":2,"金":3,"水":4}
    idx = (code % 10) if code > 0x4e00 else (code % 5)
    elems = ["木","火","土","金","水"]
    return elems[idx % 5]

class NameRequest(BaseModel):
    name: str

@router.post("/analyze")
async def analyze_name(req: NameRequest):
    chars = list(req.name)
    elements = {ch: char_wuxing(ch) for ch in chars}
    counts = {"木":0,"火":0,"土":0,"金":0,"水":0}
    for e in elements.values():
        counts[e] += 1
    
    dominant = max(counts, key=counts.get)
    total = sum(counts.values()) or 1
    harmony = int(100 - max(counts.values())/total * 100 + 30)
    harmony = min(harmony, 98)
    
    personality = {"木":"仁慈正直，富有同情心","火":"热情开朗，行动力强","土":"稳重踏实，值得信赖","金":"果断坚毅，追求完美","水":"智慧灵活，善于变通"}
    
    ai = await generate_interpretation(f"姓名：{req.name}，五行分布：{counts}，主要属性：{dominant}，请简要分析此姓名的寓意和运势。", "name")
    
    return {"name": req.name, "characters": [{"char": ch, "wuxing": elements[ch]} for ch in chars], "distribution": counts, "dominant": dominant, "harmony_score": harmony, "personality": personality.get(dominant,""), "interpretation": ai}
