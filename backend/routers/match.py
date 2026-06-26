from fastapi import APIRouter
import random

router = APIRouter(prefix="/api/match", tags=["match"])

SIGNS = ["白羊座","金牛座","双子座","巨蟹座","狮子座","处女座","天秤座","天蝎座","射手座","摩羯座","水瓶座","双鱼座"]

COMPAT = {
    (0,5):85,(0,6):78,(0,7):72,(0,8):90,(0,9):60,(0,10):68,(0,11):70,
    (1,4):80,(1,6):75,(1,7):88,(1,8):55,(1,9):92,(1,10):70,(1,11):82,
    (2,6):90,(2,8):78,(2,10):95,(2,11):85,(3,8):88,(3,9):72,(3,11):92,
    (4,0):85,(4,9):65,(4,11):78,(5,9):90,(5,10):72,(6,8):82,(6,10):88,
    (7,3):88,(7,11):85,(8,0):90,(8,2):78,(9,1):92,(9,5):90,(10,2):95,
    (11,3):92,(11,7):85
}

ELEMENTS = {"白羊座":"火","金牛座":"土","双子座":"风","巨蟹座":"水","狮子座":"火","处女座":"土","天秤座":"风","天蝎座":"水","射手座":"火","摩羯座":"土","水瓶座":"风","双鱼座":"水"}

def get_score(s1, s2):
    i, j = SIGNS.index(s1), SIGNS.index(s2)
    return COMPAT.get((i,j), COMPAT.get((j,i), random.randint(55,85)))

@router.post("/analyze")
async def analyze_match(sign1: str, sign2: str):
    score = get_score(sign1, sign2)
    e1, e2 = ELEMENTS.get(sign1,"火"), ELEMENTS.get(sign2,"火")
    if score >= 85:
        level, desc = "天作之合 💕", f"{sign1}与{sign2}是天生一对！两人的性格互补，在一起能产生奇妙的化学反应。无论是爱情还是友情，你们都能相互理解、相互支持。"
    elif score >= 70:
        level, desc = "默契搭档 🤝", f"{sign1}与{sign2}相处融洽，虽然偶有摩擦，但总体默契十足。你们在很多方面有共同语言，是不错的一对。"
    else:
        level, desc = "需要磨合 💫", f"{sign1}与{sign2}性格差异较大，但差异也意味着吸引力。如果愿意包容和理解，这段关系会带来成长。"
    return {"sign1": sign1, "sign2": sign2, "score": score, "level": level, "element1": e1, "element2": e2, "description": desc, "communication": random.randint(60,95), "emotion": random.randint(60,95), "stability": random.randint(60,95)}
