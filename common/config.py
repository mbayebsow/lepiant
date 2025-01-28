import os
from dotenv import load_dotenv

load_dotenv()

description = """
A comprehensive news aggregation and management API
that provides access to articles, press reviews,
and newspapers.

# Key Features:
- Article management with categorization
- Channel subscriptions and content delivery
- Press review access and management
- Newspaper content integration
- Real-time content updates

For detailed endpoint documentation, please
refer to the API reference below.
---
GITHUB: https://github.com/mbayebsow
<br />
TWITTER: https://x.com/mbayebsow
    """
logo_url = "https://res.cloudinary.com/dgygacilr/image/upload/b_rgb:FFFFFF/c_pad,ar_1:1/v1701189127/lepiant/app-assets/l-e-piant_nfj5a3.png"
tags_metadata = [
    {
        "name": "Authentication",
        "description": "User authentication operations including login, registration, and profile management. Handles access tokens and user sessions.",
    },
    {
        "name": "articles",
        "description": "Operations for managing news articles. Includes fetching articles by category, channel, and user subscriptions. Supports article saving and sharing features.",
    },
    {
        "name": "channels",
        "description": "News channel management endpoints. Handles channel subscriptions, listing available channels, and channel-specific content retrieval.",
    },
    {
        "name": "press-reviews",
        "description": "Daily press review operations. Access and manage press reviews with filtering by date and source.",
    },
    {
        "name": "newspapers",
        "description": "Digital newspaper management. Access daily newspapers and archives with filtering capabilities.",
    },
    {
        "name": "radios",
        "description": "Radio channel management. Access radio channels and their content with filtering capabilities.",
    },
]

contact = {
    "name": "Mbaye SOW",
    "url": "https://github.com/mbayebsow",
    "email": "mbayebabssow@gmail.com",
}

servers = [
    {
        "url": "http://0.0.0.0:8000",
        "description": "Development",
    },
    {
        "url": "https://api-news.teldoogroup.com",
        "description": "Production",
    },
]


class Config:
    ENV: str = os.getenv("ENV") or "development"
    APP_NAME = os.getenv("APP_NAME") or "lepiant"
    SECRET_KEY = os.getenv("SECRET_KEY") or "secret"
    ALGORITHM = os.getenv("ALGORITHM") or "HS256"
    PRESS_REVIEW_PATH = f"{APP_NAME}/press-reviews"
    NEWSPAPER_PATH = f"{APP_NAME}/newspapers"
    IMAGEKIT_ENDPOINT = os.getenv("IMAGEKIT_ENDPOINT")
    IMAGEKIT_PUBLIC_KEY = os.getenv("IMAGEKIT_PUBLIC_KEY")
    IMAGEKIT_PRIVATE_KEY = os.getenv("IMAGEKIT_PRIVATE_KEY")
    DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite:///./lepiant.db"
    REDIS_URL = os.getenv("REDIS_URL")
    REDIS_HOST = os.getenv("REDIS_HOST") or "localhost"
    REDIS_PORT = int(os.getenv("REDIS_PORT") or "6379")
    REDIS_SSL = os.getenv("REDIS_SSL")
    REDIS_USERNAME = os.getenv("REDIS_USERNAME")
    REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")
    CLOUDINARY_NAME = os.getenv("CLOUDINARY_NAME")
    CRONITOR_API_KEY = os.getenv("CRONITOR_API_KEY")
    BETTERSTACK_LOG_TOKEN = os.getenv("BETTERSTACK_LOG_TOKEN")
    DOC_URL = {
        "public": "/docs",
        "team": "/team-docs",
    }
    API_DESCRIPTION = description
