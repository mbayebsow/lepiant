from pydantic import BaseModel
from datetime import datetime
from typing import List, Literal, Optional


class Token(BaseModel):
    access_token: str
    token_type: str


class UserLogin(BaseModel):
    email: str
    password: str

    class Config:
        json_schema_extra = {
            "example": {"email": "demo@demo.lepiant", "password": "demo"}
        }


class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str


class UserRegister(BaseModel):
    email: str
    firstName: str
    lastName: str
    password: str
    channelSubscribed: List[int] = []


class UserProfile(BaseModel):
    id: int
    email: str
    username: str
    firstName: str
    lastName: str
    avatar: str
    language: str
    country: str
    allowNotifications: bool
    defaultStartedPage: str
    defaultArticleCategorie: int

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    avatar: Optional[str] = None
    language: Optional[Literal["fr", "en"]] = None
    country: Optional[Literal["fr", "sn"]] = None
    allowNotifications: Optional[bool] = None
    defaultStartedPage: Optional[Literal["NEWS", "RADIOS"]] = None
    defaultArticleCategorie: Optional[int] = None  # Make sure this matches the model

    class Config:
        from_attributes = True


class ArticleOut(BaseModel):
    id: int
    channelId: int
    categorieId: int
    title: str
    description: str
    image: str
    published: datetime

    class Config:
        from_attributes = True


class ArticleCategoriesOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class ChannelOut(BaseModel):
    id: int
    name: str
    webSite: str
    logo: str
    fullLogo: str
    country: str
    language: str

    class Config:
        from_attributes = True


class RadioCategorieOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class RadioOut(BaseModel):
    id: int
    name: str
    source: str
    image: str
    categorieId: int

    class Config:
        from_attributes = True


class NewspaperOut(BaseModel):
    id: int
    images: str
    publishedAt: str
    thumbnailUrl: str

    class Config:
        from_attributes = True


class PressReviewOut(BaseModel):
    id: int
    name: str
    audio: str
    publishedAt: str

    class Config:
        from_attributes = True


class ChannelDetailOut(BaseModel):
    id: int
    name: str
    description: str | None = None
    logo: str | None = None
    language: str | None = None
    country: str | None = None
    isActive: bool
    subscribers_count: int
    articles_count: int
    is_subscribed: bool

    class Config:
        from_attributes = True
