from fastapi import Depends, HTTPException, status
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)
from sqlalchemy.orm import Session
from sqlalchemy.exc import TimeoutError
from redis import Redis
from datetime import datetime, timedelta
import json
import secrets
import string
import logging

from .models import User, AccessKeys
from .database import SessionLocal
from .config import Config

logger = logging.getLogger(__name__)
# Configuration JWT
security = HTTPBearer()  # OAuth2PasswordBearer(tokenUrl="v1/auth/login")


# Génération de token
async def generate_token(length: int = 50) -> str:
    characters = string.ascii_letters + string.digits
    token = "".join(secrets.choice(characters) for _ in range(length))
    return token


# @contextmanager
def get_db():
    db = SessionLocal()
    try:
        db.connection(execution_options={"timeout": 10})  # 10 second timeout
        yield db
    except TimeoutError:
        logger.error("Database operation timed out")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Database operation timed out",
        )
    finally:
        db.close()


# Dependency pour Redis
def get_redis() -> Redis:
    return Redis(
        host=Config.REDIS_HOST,
        port=Config.REDIS_PORT,
        username=Config.REDIS_USERNAME,
        password=Config.REDIS_PASSWORD,
        decode_responses=True,
        ssl=True,
        ssl_cert_reqs="none",
        socket_timeout=5,
        socket_keepalive=True,
        retry_on_timeout=True,
        max_connections=10,
    )


# Dependency pour l'utilisateur courant
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        redis = get_redis()
        token = credentials.credentials
        cache_access_key = redis.get(f"access_key:{token}")

        if cache_access_key:
            access_key_dict = json.loads(str(cache_access_key))
            user_id = access_key_dict.get("userId")
        else:
            access_key = db.query(AccessKeys).filter(AccessKeys.token == token).first()
            if not access_key:
                raise credentials_exception
            access_key_dict = access_key.to_dict()
            user_id = access_key.userId
            redis.set(f"access_key:{token}", json.dumps(access_key_dict))

        cache_user = redis.get(f"users:{user_id}")
        if cache_user:
            user_dict = json.loads(str(cache_user))
        else:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise credentials_exception
            user_dict = user.to_dict()
            redis.set(f"users:{user_id}", json.dumps(user_dict))

        return User(**user_dict)

    except Exception as e:
        logger.error(f"Error in get_current_user: {str(e)}")
        raise credentials_exception


async def create_user_access_key(db: Session, user: User) -> AccessKeys:
    try:
        token = await generate_token()
        expire_date = datetime.utcnow() + timedelta(days=360)

        access_key = AccessKeys(
            userId=user.id,
            token=token,
            lastActivity=datetime.utcnow(),
            createAt=datetime.utcnow(),
            expireAt=expire_date,
        )

        db.add(access_key)
        db.commit()

        redis = get_redis()
        redis.set(f"access_key:{str(token)}", json.dumps(access_key.to_dict()))
        redis.set(f"users:{str(user.id)}", json.dumps(user.to_dict()))
        return access_key
    except Exception as e:
        logger.error(f"Error in create_user_access_key: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating access key",
        )
