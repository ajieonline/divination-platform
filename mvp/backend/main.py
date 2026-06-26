from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Date, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
import os

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://coal_admin:coal_secret_2024@postgres:5432/coal_data_mvp")
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class CoalPriceHistory(Base):
    __tablename__ = "coal_price_history"
    
    id = Column(Integer, primary_key=True, index=True)
    coal_type = Column(String(50), nullable=False)
    region = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    unit = Column(String(20), default="元/吨")
    date = Column(Date, nullable=False)
    data_source = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

class CoalPrediction(Base):
    __tablename__ = "coal_prediction"
    
    id = Column(Integer, primary_key=True, index=True)
    coal_type = Column(String(50), nullable=False)
    region = Column(String(100), nullable=False)
    prediction_date = Column(Date, nullable=False)
    predicted_price = Column(Float, nullable=False)
    confidence_lower = Column(Float)
    confidence_upper = Column(Float)
    model_version = Column(String(20))
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

class UserMember(Base):
    __tablename__ = "user_member"
    
    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(20), unique=True, nullable=False)
    nickname = Column(String(100))
    membership_level = Column(String(20), default="free")
    membership_expire = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pydantic models
class CoalPriceResponse(BaseModel):
    id: int
    coal_type: str
    region: str
    price: float
    unit: str
    date: date
    data_source: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class PredictionResponse(BaseModel):
    id: int
    coal_type: str
    region: str
    prediction_date: date
    predicted_price: float
    confidence_lower: Optional[float]
    confidence_upper: Optional[float]
    model_version: Optional[str]
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    phone: str
    nickname: Optional[str]

class UserResponse(BaseModel):
    id: int
    phone: str
    nickname: Optional[str]
    membership_level: str
    membership_expire: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

# FastAPI app
app = FastAPI(title="煤炭数据平台 MVP", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "煤炭数据平台 MVP API"}

@app.get("/api/v1/prices", response_model=List[CoalPriceResponse])
async def get_prices(
    coal_type: Optional[str] = None,
    region: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CoalPriceHistory)
    
    if coal_type:
        query = query.filter(CoalPriceHistory.coal_type == coal_type)
    if region:
        query = query.filter(CoalPriceHistory.region == region)
    if start_date:
        query = query.filter(CoalPriceHistory.date >= start_date)
    if end_date:
        query = query.filter(CoalPriceHistory.date <= end_date)
    
    return query.order_by(CoalPriceHistory.date.desc()).all()

@app.get("/api/v1/prices/{coal_type}", response_model=List[CoalPriceResponse])
async def get_prices_by_type(coal_type: str, db: Session = Depends(get_db)):
    return db.query(CoalPriceHistory)\
        .filter(CoalPriceHistory.coal_type == coal_type)\
        .order_by(CoalPriceHistory.date.desc())\
        .all()

@app.get("/api/v1/prices/trend/{coal_type}")
async def get_price_trend(
    coal_type: str,
    days: int = 30,
    db: Session = Depends(get_db)
):
    from datetime import timedelta
    start_date = date.today() - timedelta(days=days)
    
    prices = db.query(CoalPriceHistory)\
        .filter(CoalPriceHistory.coal_type == coal_type)\
        .filter(CoalPriceHistory.date >= start_date)\
        .order_by(CoalPriceHistory.date.asc())\
        .all()
    
    return {
        "coal_type": coal_type,
        "period": f"近{days}天",
        "data": [
            {
                "date": p.date.isoformat(),
                "price": p.price,
                "region": p.region
            }
            for p in prices
        ]
    }

@app.get("/api/v1/predictions", response_model=List[PredictionResponse])
async def get_predictions(
    coal_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CoalPrediction).filter(CoalPrediction.status == "active")
    
    if coal_type:
        query = query.filter(CoalPrediction.coal_type == coal_type)
    
    return query.order_by(CoalPrediction.prediction_date.asc()).all()

@app.get("/api/v1/predictions/{coal_type}", response_model=List[PredictionResponse])
async def get_predictions_by_type(coal_type: str, db: Session = Depends(get_db)):
    return db.query(CoalPrediction)\
        .filter(CoalPrediction.coal_type == coal_type)\
        .filter(CoalPrediction.status == "active")\
        .order_by(CoalPrediction.prediction_date.asc())\
        .all()

@app.post("/api/v1/auth/login", response_model=UserResponse)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(UserMember).filter(UserMember.phone == user.phone).first()
    
    if not db_user:
        db_user = UserMember(
            phone=user.phone,
            nickname=user.nickname or f"用户{user.phone[-4:]}",
            membership_level="free"
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    
    return db_user

@app.get("/api/v1/user/{phone}", response_model=UserResponse)
async def get_user(phone: str, db: Session = Depends(get_db)):
    user = db.query(UserMember).filter(UserMember.phone == phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user

@app.get("/api/v1/coal-types")
async def get_coal_types(db: Session = Depends(get_db)):
    types = db.query(CoalPriceHistory.coal_type).distinct().all()
    return {"coal_types": [t[0] for t in types]}

@app.get("/api/v1/regions")
async def get_regions(db: Session = Depends(get_db)):
    regions = db.query(CoalPriceHistory.region).distinct().all()
    return {"regions": [r[0] for r in regions]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
