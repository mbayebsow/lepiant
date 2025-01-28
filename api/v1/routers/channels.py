import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi_paginate import Page, paginate
from common.models import Channel, ChannelSubscribed, User, Article
from common.dependencies import get_db, get_current_user, get_redis
from common.schemas import ChannelOut
from sqlalchemy import distinct, func
from common.schemas import ChannelDetailOut
import logging

logger = logging.getLogger(__name__)

CACHE_TTL = 60 * 15  # 15 minutes cache

router = APIRouter(prefix="/channels", tags=["channels"])


@router.get("/", response_model=Page[ChannelOut], status_code=status.HTTP_200_OK)
async def get_all_channels(
    db: Session = Depends(get_db),
    redis=Depends(get_redis),
    language: str | None = None,
    country: str | None = None,
    current_user: list = Depends(get_current_user),
):
    try:
        cache_key = f"channels:all:lang_{language}:country_{country}"
        cached_channels = redis.get(cache_key)

        if cached_channels:
            return paginate(json.loads(cached_channels))

        query = db.query(Channel).filter(Channel.isActive)

        if language:
            query = query.filter(Channel.language == language)

        if country:
            query = query.filter(Channel.country == country)

        channels = query.order_by(Channel.name.asc()).all()
        channels_list = [channel.to_dict() for channel in channels]

        redis.setex(cache_key, CACHE_TTL, json.dumps(channels_list))
        return paginate(channels)
    except Exception as e:
        logger.error(f"Error fetching channels: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch channels",
        )


@router.get(
    "/subscribed", response_model=Page[ChannelOut], status_code=status.HTTP_200_OK
)
async def get_subscribed_channels(
    db: Session = Depends(get_db),
    redis=Depends(get_redis),
    current_user: User = Depends(get_current_user),
):
    try:
        cache_key = f"channels:subscribed:{current_user.id}"
        cached_channels = redis.get(cache_key)

        if cached_channels:
            return paginate(json.loads(cached_channels))

        channels = (
            db.query(Channel)
            .join(ChannelSubscribed, Channel.id == ChannelSubscribed.channelId)
            .filter(ChannelSubscribed.userId == current_user.id, Channel.isActive)
            .order_by(Channel.name.asc())
            .all()
        )

        channels_list = [channel.to_dict() for channel in channels]
        redis.setex(cache_key, CACHE_TTL, json.dumps(channels_list))
        return paginate(channels)
    except Exception as e:
        logger.error(f"Error fetching subscribed channels: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch subscribed channels",
        )


@router.get(
    "/{channel_id}",
    response_model=ChannelDetailOut,
    status_code=status.HTTP_200_OK,
)
async def get_channel_details(
    channel_id: int,
    db: Session = Depends(get_db),
    redis=Depends(get_redis),
    current_user: User = Depends(get_current_user),
):
    try:
        cache_key = f"channel:detail:{channel_id}:{current_user.id}"
        cached_channel = redis.get(cache_key)

        if cached_channel:
            return json.loads(cached_channel)

        channel_details = (
            db.query(
                Channel,
                func.count(distinct(ChannelSubscribed.userId)).label(
                    "subscribers_count"
                ),
                func.count(distinct(Article.id)).label("articles_count"),
            )
            .outerjoin(ChannelSubscribed, Channel.id == ChannelSubscribed.channelId)
            .outerjoin(Article, Channel.id == Article.channelId)
            .filter(Channel.id == channel_id, Channel.isActive)
            .group_by(Channel.id)
            .first()
        )

        if not channel_details:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Channel not found or inactive",
            )

        is_subscribed = (
            db.query(ChannelSubscribed)
            .filter(
                ChannelSubscribed.channelId == channel_id,
                ChannelSubscribed.userId == current_user.id,
            )
            .first()
            is not None
        )

        result = {
            **channel_details[0].to_dict(),
            "subscribers_count": channel_details[1],
            "articles_count": channel_details[2],
            "is_subscribed": is_subscribed,
        }

        redis.setex(cache_key, CACHE_TTL, json.dumps(result))
        return result

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error fetching channel details: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch channel details",
        )


@router.post("/{channel_id}/toggle-subscribe")
async def toggle_channel_subscribe(
    channel_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    redis=Depends(get_redis),
):
    try:
        # Verify if channel exists and is active
        channel = (
            db.query(Channel).filter(Channel.id == channel_id, Channel.isActive).first()
        )

        if not channel:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Channel not found or inactive",
            )

        existing_subscription = (
            db.query(ChannelSubscribed)
            .filter(
                ChannelSubscribed.userId == current_user.id,
                ChannelSubscribed.channelId == channel_id,
            )
            .first()
        )

        if existing_subscription:
            db.delete(existing_subscription)
            db.commit()
            result = {
                "status": "success",
                "message": "Channel unsubscribed successfully",
                "subscribed": False,
            }
        else:
            new_subscription = ChannelSubscribed(
                userId=current_user.id, channelId=channel_id
            )
            db.add(new_subscription)
            db.commit()
            result = {
                "status": "success",
                "message": "Channel subscribed successfully",
                "subscribed": True,
            }

        # Invalidate related caches
        redis.delete(f"channel:detail:{channel_id}:{current_user.id}")
        redis.delete(f"channels:subscribed:{current_user.id}")
        redis.delete(f"channels:all*")

        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error toggling channel subscription: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to toggle channel subscription",
        )
