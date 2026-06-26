import os
from typing import Optional, Dict, Any
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
AI_MODEL = os.getenv("AI_MODEL", "gpt-3.5-turbo")


class AIService:
    def __init__(self):
        if OPENAI_API_KEY:
            self.client = OpenAI(
                api_key=OPENAI_API_KEY,
                base_url=OPENAI_BASE_URL
            )
        else:
            self.client = None

    def generate_reading(self, prompt: str, max_tokens: int = 800) -> str:
        """Generate AI interpretation text."""
        if not self.client:
            return self._fallback_reading(prompt)

        try:
            response = self.client.chat.completions.create(
                model=AI_MODEL,
                messages=[
                    {"role": "system", "content": "你是一位资深的命理师和占卜专家，精通中国传统文化、西方占星术、塔罗牌、易经等各类占卜方法。你的解读详细、专业、温暖，能给求问者带来启发和指引。请用中文回复。"},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens,
                temperature=0.8,
                top_p=0.9
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"AI service error: {e}")
            return self._fallback_reading(prompt)

    def _fallback_reading(self, prompt: str) -> str:
        """Provide a fallback reading when AI service is unavailable."""
        return (
            "✨ 灵境占卜提示 ✨\n\n"
            "当前AI解读服务暂时不可用，请稍后再试。\n"
            "您的占卜数据已保存，稍后可获取完整解读。\n\n"
            "🔮 灵境占卜，指引人生方向"
        )


ai_service = AIService()
