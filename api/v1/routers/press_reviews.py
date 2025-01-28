import datetime
import logging
import json
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from common.dependencies import get_current_user, get_db, get_redis
from common.models import PressReviews, User
from common.schemas import PressReviewOut

logger = logging.getLogger(__name__)
CACHE_TTL = 60 * 60 * 24  # 24 hours
router = APIRouter(prefix="/press-reviews", tags=["press-reviews"])


@router.get("/", response_model=List[PressReviewOut])
async def get_press_reviews(
    date: str = Query(
        default=datetime.date.today().strftime("%Y-%m-%d"),
        description="Filter by date (YYYY-MM-DD)",
    ),
    db: Session = Depends(get_db),
    redis=Depends(get_redis),
    current_user: User = Depends(get_current_user),
) -> List[PressReviewOut]:
    try:
        cache_key = f"press_reviews:{date}:all"
        cached_reviews = redis.get(cache_key)

        if cached_reviews:
            return json.loads(cached_reviews)

        reviews = db.query(PressReviews).filter(PressReviews.publishedAt == date).all()
        reviews_list = [review.to_dict() for review in reviews]
        redis.setex(cache_key, CACHE_TTL, json.dumps(reviews_list))

        return [PressReviewOut(**review) for review in reviews_list]
    except Exception as e:
        logger.error(f"Error fetching press reviews: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch press reviews",
        )
