import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi_paginate import Page, paginate
from common.models import Radio, RadioLiked, User, RadioCategorie
from common.dependencies import get_db, get_current_user, get_redis
from common.schemas import RadioOut, RadioCategorieOut
import logging

logger = logging.getLogger(__name__)

CACHE_TTL = 60 * 15  # 15 minutes cache

router = APIRouter(prefix="/radios", tags=["radios"])


@router.get("/", response_model=Page[RadioOut])
async def get_all_radios(
    db: Session = Depends(get_db),
    redis=Depends(get_redis),
    current_user: User = Depends(get_current_user),
):
    try:
        cache_key = "radios:all"
        cached_radios = redis.get(cache_key)

        if cached_radios:
            return paginate(json.loads(cached_radios))

        radios = db.query(Radio).filter(Radio.isActive).order_by(Radio.name.asc()).all()
        radios_list = [radio.to_dict() for radio in radios]

        redis.setex(cache_key, CACHE_TTL, json.dumps(radios_list))
        return paginate(radios)
    except Exception as e:
        logger.error(f"Error fetching radios: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch radios",
        )


@router.get("/liked", response_model=Page[RadioOut])
async def get_user_liked_radios(
    db: Session = Depends(get_db),
    redis=Depends(get_redis),
    current_user: User = Depends(get_current_user),
):
    try:
        cache_key = f"radios:liked:{current_user.id}"
        cached_radios = redis.get(cache_key)

        if cached_radios:
            return paginate(json.loads(cached_radios))

        liked_radios = (
            db.query(Radio)
            .join(RadioLiked, Radio.id == RadioLiked.radioId)
            .filter(RadioLiked.userId == current_user.id, Radio.isActive)
            .order_by(Radio.name.asc())
            .all()
        )

        radios_list = [radio.to_dict() for radio in liked_radios]
        redis.setex(cache_key, CACHE_TTL, json.dumps(radios_list))
        return paginate(liked_radios)
    except Exception as e:
        logger.error(f"Error fetching liked radios: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch liked radios",
        )


@router.get("/categories", response_model=List[RadioCategorieOut])
async def get_all_radio_categories(
    db: Session = Depends(get_db),
    redis=Depends(get_redis),
    current_user: User = Depends(get_current_user),
):
    try:
        cache_key = "radio:categories"
        cached_categories = redis.get(cache_key)

        if cached_categories:
            return json.loads(cached_categories)

        categories = db.query(RadioCategorie).order_by(RadioCategorie.name.asc()).all()
        categories_list = [category.to_dict() for category in categories]

        redis.setex(cache_key, CACHE_TTL, json.dumps(categories_list))
        return categories
    except Exception as e:
        logger.error(f"Error fetching radio categories: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch radio categories",
        )


@router.post("/{radio_id}/toggle-like")
async def toggle_radio_like(
    radio_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    redis=Depends(get_redis),
):
    try:
        existing_like = (
            db.query(RadioLiked)
            .filter(
                RadioLiked.userId == current_user.id, RadioLiked.radioId == radio_id
            )
            .first()
        )

        if existing_like:
            db.delete(existing_like)
            db.commit()
            result = {"message": "Radio unliked successfully"}
        else:
            new_like = RadioLiked(userId=current_user.id, radioId=radio_id)
            db.add(new_like)
            db.commit()
            result = {"message": "Radio liked successfully"}

        # Invalidate related caches
        redis.delete(f"radios:liked:{current_user.id}")
        redis.delete("radios:all")

        return result
    except Exception as e:
        logger.error(f"Error toggling radio like: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to like radio",
        )
