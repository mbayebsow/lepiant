import datetime
import logging
import json
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from common.dependencies import get_current_user, get_db, get_redis
from common.models import Newspapers, User
from common.schemas import NewspaperOut

router = APIRouter(prefix="/newspapers", tags=["newspapers"])
logger = logging.getLogger(__name__)
CACHE_TTL = 60 * 60 * 24  # 24 hours


@router.get("/", response_model=List[NewspaperOut])
async def get_newspapers(
    date: str = Query(
        default=datetime.date.today().strftime("%Y-%m-%d"),
        description="Filter by date (YYYY-MM-DD)",
    ),
    db: Session = Depends(get_db),
    redis=Depends(get_redis),
    current_user: User = Depends(get_current_user),
) -> List[NewspaperOut]:
    try:
        cache_key = f"newspapers:{date}:all"
        cached_reviews = redis.get(cache_key)

        if cached_reviews:
            return json.loads(cached_reviews)

        newspapers = db.query(Newspapers).filter(Newspapers.publishedAt == date).all()
        newspapers_list = [review.to_dict() for review in newspapers]
        redis.setex(cache_key, CACHE_TTL, json.dumps(newspapers_list))

        return [NewspaperOut(**newspapers) for newspapers in newspapers_list]
    except Exception as e:
        logger.error(f"Error fetching newspapers: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching newspapers.",
        )
