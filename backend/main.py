from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import tarot, zodiac, iching, bazi, match, dream, name, signin, user, payment

app = FastAPI(title="灵境占卜 API", version="1.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(tarot.router)
app.include_router(zodiac.router)
app.include_router(iching.router)
app.include_router(bazi.router)
app.include_router(match.router)
app.include_router(dream.router)
app.include_router(name.router)
app.include_router(signin.router)
app.include_router(user.router)
app.include_router(payment.router)

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "灵境占卜 API"}
