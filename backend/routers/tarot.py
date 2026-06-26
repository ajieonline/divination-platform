"""塔罗牌占卜路由模块"""
import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from models import User, DivinationRecord
from services.tarot_data import get_all_cards, get_card_by_number, get_major_arcana, get_minor_arcana
from services.ai_service import ai_service
from services.fortune_prompts import TAROT_PROMPT_TEMPLATE

router = APIRouter(prefix="/api/tarot", tags=["塔罗牌"])


class TarotDrawRequest(BaseModel):
    spread_type: str = "single"  # single, three_card, celtic_cross
    question: str = ""


class TarotInterpretRequest(BaseModel):
    cards: list[dict]
    question: str = ""


@router.get("/cards")
async def get_tarot_cards():
    """获取所有78张塔罗牌"""
    cards = get_all_cards()
    major = get_major_arcana()
    minor = get_minor_arcana()
    return {
        "total": len(cards),
        "major_arcana": {
            "count": len(major),
            "cards": major
        },
        "minor_arcana": {
            "count": len(minor),
            "cards": minor
        }
    }


@router.post("/draw")
async def draw_cards(
    request: TarotDrawRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """抽牌占卜"""
    spread_configs = {
        "single": {"count": 1, "name": "单牌占卜", "positions": ["当前状况"]},
        "three_card": {"count": 3, "name": "三牌占卜", "positions": ["过去", "现在", "未来"]},
        "celtic_cross": {"count": 10, "name": "凯尔特十字", "positions": [
            "当前状况", "挑战", "过去基础", "近期过去", "可能结果",
            "近未来", "自我态度", "外在环境", "希望与恐惧", "最终结果"
        ]},
    }

    spread = spread_configs.get(request.spread_type, spread_configs["single"])
    all_cards = get_all_cards()
    drawn_indices = random.sample(range(len(all_cards)), spread["count"])

    drawn_cards = []
    for i, idx in enumerate(drawn_indices):
        card = all_cards[idx].copy()
        is_reversed = random.random() > 0.65
        card["is_reversed"] = is_reversed
        card["position"] = spread["positions"][i]
        card["meaning"] = card["reversed_meaning"] if is_reversed else card["upright_meaning"]
        card["orientation"] = "逆位" if is_reversed else "正位"
        drawn_cards.append(card)

    # 保存占卜记录
    record = DivinationRecord(
        user_id=current_user.id,
        divination_type="tarot",
        input_data=f'{{"spread": "{request.spread_type}", "question": "{request.question}"}}',
        result=str([{"name": c["card_name_cn"], "position": c["position"], "orientation": c["orientation"]} for c in drawn_cards]),
        interpretation="待AI解读",
    )
    db.add(record)
    db.commit()

    return {
        "spread_name": spread["name"],
        "spread_type": request.spread_type,
        "question": request.question,
        "cards": drawn_cards,
        "record_id": record.id,
    }


@router.post("/interpret")
async def interpret_cards(
    request: TarotInterpretRequest,
    current_user: User = Depends(get_current_user)
):
    """AI解读塔罗牌"""
    card_descriptions = []
    for card in request.cards:
        orientation = "逆位" if card.get("is_reversed") else "正位"
        meaning = card.get("reversed_meaning", "") if card.get("is_reversed") else card.get("upright_meaning", "")
        position = card.get("position", "")
        card_descriptions.append(
            f"【{card.get('card_name_cn', card.get('name', '未知'))}】{orientation} - 位置：{position}\n"
            f"含义：{meaning}\n描述：{card.get('description', '')}"
        )

    prompt = TAROT_PROMPT_TEMPLATE.format(
        card_info="\n\n".join(card_descriptions),
        question=request.question or "请为我解读整体运势"
    )

    interpretation = ai_service.generate_reading(prompt)

    return {
        "interpretation": interpretation,
        "cards_analyzed": len(request.cards),
    }
