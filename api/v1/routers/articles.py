import json
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi_paginate import Page, paginate
from sqlalchemy.orm import Session

from common.dependencies import get_current_user, get_db, get_redis
from common.models import (
    Article,
    ArticleCategorie,
    ArticleSaved,
    ArticleShared,
    ChannelSubscribed,
    User,
)
from common.schemas import ArticleCategoriesOut, ArticleOut

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/articles", tags=["articles"])

CACHE_TTL = 60 * 15  # 15 minutes cache


@router.get("/categories", response_model=List[ArticleCategoriesOut])
async def get_article_categories(
    db: Session = Depends(get_db),
    redis=Depends(get_redis),
    current_user: list = Depends(get_current_user),
):
    try:
        # Try to get from cache
        cache_key = "article_categories"
        cached_categories = redis.get(cache_key)

        if cached_categories:
            return paginate(json.loads(cached_categories))

        # If not in cache, get from DB
        categories = db.query(ArticleCategorie).all()

        # Convert to dict for JSON serialization
        categories_list = [categorie.to_dict() for categorie in categories]

        # Store in cache
        redis.setex(cache_key, CACHE_TTL, json.dumps(categories_list))

        return categories
    except Exception as e:
        logger.error(f"Error fetching article categories: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch article categories",
        )


@router.get("/subscribed", response_model=Page[ArticleOut])
async def get_subscribed_articles(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    redis=Depends(get_redis),
    categorie_id: int | None = None,
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
):
    try:
        cache_key = f"subscribed_articles:{current_user.id}:cat_{categorie_id}:page_{page}:size_{size}"
        cached_articles = redis.get(cache_key)

        if cached_articles:
            # return paginate(json.loads(cached_articles))
            pass

        # Your existing database query logic
        offset = (page - 1) * size
        channel_ids = (
            db.query(ChannelSubscribed.channelId)
            .filter(ChannelSubscribed.userId == current_user.id)
            .all()
        )

        if not channel_ids:
            return paginate([])

        query = db.query(Article).filter(
            Article.channelId.in_([c[0] for c in channel_ids]), Article.isActive
        )

        if categorie_id:
            query = query.filter(Article.categorieId == categorie_id)

        articles = query.order_by(Article.published.desc()).offset(offset).all()

        # Convert to dict for JSON serialization
        articles_list = [article.to_dict() for article in articles]

        # Cache the results
        redis.setex(cache_key, CACHE_TTL, json.dumps(articles_list))

        return paginate(articles)
    except Exception as e:
        logger.error(f"Error fetching subscribed articles: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch subscribed articles",
        )


@router.get("/{article_id}", response_model=ArticleOut)
async def get_article_by_id(
    article_id: int,
    db: Session = Depends(get_db),
    redis=Depends(get_redis),
    current_user: list = Depends(get_current_user),
):
    try:
        # Try to get from cache
        cache_key = f"article:{article_id}"
        cached_article = redis.get(cache_key)

        if cached_article:
            return json.loads(cached_article)

        article = (
            db.query(Article).filter(Article.id == article_id, Article.isActive).first()
        )

        if not article:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article not found or inactive",
            )

        # Cache the article
        redis.setex(cache_key, CACHE_TTL, json.dumps(article.to_dict()))

        return article
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error fetching article: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch article",
        )


@router.get(
    "/channel/{channel_id}",
    response_model=Page[ArticleOut],
    status_code=status.HTTP_200_OK,
)
async def get_articles_by_channel(
    channel_id: int,
    db: Session = Depends(get_db),
    redis=Depends(get_redis),
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    current_user: list = Depends(get_current_user),
):
    try:
        # Try to get from cache
        cache_key = f"articles_channel:{channel_id}:{page}:{size}"
        cached_article = redis.get(cache_key)

        if cached_article:
            return paginate(json.loads(cached_article))

        offset = (page - 1) * size

        articles = (
            db.query(Article)
            .filter(Article.channelId == channel_id, Article.isActive)
            .order_by(Article.published.desc())
            .offset(offset)
            .all()
        )

        articles_list = [article.to_dict() for article in articles]

        # Cache the results
        redis.setex(cache_key, CACHE_TTL, json.dumps(articles_list))

        return paginate(articles)
    except Exception as e:
        logger.error(f"Error fetching channel articles: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch channel articles",
        )


@router.post("/{article_id}/toggle-save", status_code=status.HTTP_200_OK)
async def toggle_article_save(
    article_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        # Verify if article exists and is active
        article = (
            db.query(Article).filter(Article.id == article_id, Article.isActive).first()
        )

        if not article:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article not found or inactive",
            )

        existing_save = (
            db.query(ArticleSaved)
            .filter(
                ArticleSaved.userId == current_user.id,
                ArticleSaved.articleId == article_id,
            )
            .first()
        )

        if existing_save:
            db.delete(existing_save)
            db.commit()
            return {
                "status": "success",
                "message": "Article unsaved successfully",
                "saved": False,
            }

        new_save = ArticleSaved(userId=current_user.id, articleId=article_id)
        db.add(new_save)
        db.commit()
        return {
            "status": "success",
            "message": "Article saved successfully",
            "saved": True,
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error toggling article save status: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to toggle article save status",
        )


@router.post("/{article_id}/share/{platform}", status_code=status.HTTP_200_OK)
async def share_article(
    article_id: int,
    platform: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        # Verify if article exists and is active
        article = (
            db.query(Article).filter(Article.id == article_id, Article.isActive).first()
        )

        if not article:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article not found or inactive",
            )

        # Validate platform
        valid_platforms = ["facebook", "twitter", "whatsapp", "telegram"]
        if platform.lower() not in valid_platforms:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid platform. Must be one of: {', '.join(valid_platforms)}",
            )

        new_share = ArticleShared(
            userId=current_user.id, articleId=article_id, shareTo=platform.lower()
        )
        db.add(new_share)
        db.commit()

        return {
            "status": "success",
            "message": "Article shared successfully",
            "platform": platform.lower(),
        }
    except HTTPException as he:
        logger.error(f"HTTPException: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Error sharing article: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to share article",
        )
