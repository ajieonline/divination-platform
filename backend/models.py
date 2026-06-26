from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    nickname = Column(String(50), default="")
    avatar = Column(String(255), default="")
    birth_date = Column(String(10), default="")
    birth_time = Column(String(5), default="")
    zodiac_sign = Column(String(20), default="")
    is_active = Column(Boolean, default=True)
    is_vip = Column(Boolean, default=False)
    vip_expire_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    divination_records = relationship("DivinationRecord", back_populates="user")
    daily_fortunes = relationship("DailyFortune", back_populates="user")
    sign_ins = relationship("SignIn", back_populates="user")


class DivinationRecord(Base):
    __tablename__ = "divination_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    divination_type = Column(String(50), nullable=False)
    input_data = Column(Text, nullable=False)
    result = Column(Text, nullable=False)
    interpretation = Column(Text, nullable=False)
    is_favorite = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="divination_records")


class ZodiacData(Base):
    __tablename__ = "zodiac_data"

    id = Column(Integer, primary_key=True, index=True)
    sign_name = Column(String(20), unique=True, nullable=False)
    sign_name_cn = Column(String(20), nullable=False)
    date_range = Column(String(30), nullable=False)
    element = Column(String(10), nullable=False)
    ruling_planet = Column(String(20), nullable=False)
    personality_traits = Column(Text, nullable=False)
    strengths = Column(Text, nullable=False)
    weaknesses = Column(Text, nullable=False)
    compatible_signs = Column(String(100), nullable=False)
    lucky_numbers = Column(String(50), default="")
    lucky_colors = Column(String(100), default="")

    daily_fortunes = relationship("DailyFortune", back_populates="zodiac")


class TarotCard(Base):
    __tablename__ = "tarot_cards"

    id = Column(Integer, primary_key=True, index=True)
    card_number = Column(Integer, nullable=False)
    card_name = Column(String(50), nullable=False)
    card_name_cn = Column(String(50), nullable=False)
    arcana_type = Column(String(20), nullable=False)
    suit = Column(String(20), default="")
    upright_meaning = Column(Text, nullable=False)
    reversed_meaning = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    keywords = Column(String(200), default="")


class DailyFortune(Base):
    __tablename__ = "daily_fortunes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    zodiac_id = Column(Integer, ForeignKey("zodiac_data.id"), nullable=False)
    fortune_date = Column(DateTime, nullable=False)
    love_fortune = Column(Integer, default=0)
    career_fortune = Column(Integer, default=0)
    wealth_fortune = Column(Integer, default=0)
    health_fortune = Column(Integer, default=0)
    overall_score = Column(Integer, default=0)
    description = Column(Text, nullable=False)
    lucky_color = Column(String(20), default="")
    lucky_number = Column(Integer, default=0)
    lucky_direction = Column(String(10), default="")
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="daily_fortunes")
    zodiac = relationship("ZodiacData", back_populates="daily_fortunes")


class Membership(Base):
    __tablename__ = "memberships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_type = Column(String(20), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), default="")
    status = Column(String(20), default="active")
    created_at = Column(DateTime, server_default=func.now())


class SignIn(Base):
    __tablename__ = "sign_ins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sign_date = Column(DateTime, nullable=False)
    streak_days = Column(Integer, default=1)
    points_earned = Column(Integer, default=10)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="sign_ins")
