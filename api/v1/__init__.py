from fastapi import APIRouter

from common.config import Config
from .routers import auth, articles, radios, channels, press_reviews, newspapers
from logtail import LogtailHandler
import logging

handler = LogtailHandler(source_token=Config.BETTERSTACK_LOG_TOKEN)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(handler)

v1_router = APIRouter()

v1_router.include_router(auth.router)
v1_router.include_router(articles.router)
v1_router.include_router(radios.router)
v1_router.include_router(channels.router)
v1_router.include_router(press_reviews.router)
v1_router.include_router(newspapers.router)
