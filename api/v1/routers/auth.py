import json
from fastapi import APIRouter, Depends, HTTPException, status
from redis import Redis
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from common.schemas import (
    Token,
    UserLogin,
    UserLoginResponse,
    UserProfileUpdate,
    UserRegister,
    UserProfile,
)
from common.models import User, ChannelSubscribed, AccessKeys
from common.dependencies import (
    get_db,
    get_current_user,
    create_user_access_key,
    get_redis,
)
from utils.verify_password import verify_password
from utils.hash_password import hash_password

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=Token, include_in_schema=False)
async def login(
    user_login: UserLogin,
    db: Session = Depends(get_db),
    redis: Redis = Depends(get_redis),
) -> UserLoginResponse:
    try:
        user = db.query(User).filter(User.email == user_login.email).first()
        if not user or not verify_password(user_login.password, str(user.password)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials"
            )

        access_key = db.query(AccessKeys).filter(AccessKeys.userId == user.id).first()

        if not access_key:
            access_key = await create_user_access_key(db, user)

        redis.set(
            f"access_key:{str(access_key.token)}", json.dumps(access_key.to_dict())
        )
        redis.set(f"users:{str(user.id)}", json.dumps(user.to_dict()))

        res = UserLoginResponse(
            access_token=str(access_key.token),
            token_type="bearer",
        )
        return res
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials"
        )


@router.post("/register", response_model=Token, include_in_schema=False)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Clean email and convert to lowercase
    cleaned_email = user_data.email.strip().lower()

    # Check if email already exists (case insensitive)
    existing_user = db.query(User).filter(User.email.ilike(cleaned_email)).all()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Extract the username from the email
    user_name = cleaned_email.split("@")[0]

    # Create new user with cleaned email
    new_user = User(
        email=cleaned_email,
        firstName=user_data.firstName,
        lastName=user_data.lastName,
        username=user_name,
        password=hash_password(user_data.password),
    )

    access_key = await create_user_access_key(db, new_user)

    try:
        db.add(new_user)
        db.flush()  # Flush to get the new user ID

        # Add channel subscriptions
        for channel_id in user_data.channelSubscribed:
            subscription = ChannelSubscribed(userId=new_user.id, channelId=channel_id)
            db.add(subscription)

        db.commit()
    except IntegrityError as e:
        db.rollback()
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Database integrity error"
        )
    except Exception as e:
        print(e)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )

    # Return access token
    return {
        "access_token": access_key.token,
        "token_type": "bearer",
    }


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserProfile, include_in_schema=False)
async def update_user_profile(
    user_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        # Clean email and convert to lowercase if provided
        cleaned_email = current_user.email.strip().lower()

        # Check if new email already exists (case insensitive)
        existing_user = (
            db.query(User)
            .filter(User.email.ilike(cleaned_email), User.id != current_user.id)
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        # Update other fields if provided
        if user_data.firstName:
            setattr(current_user, "firstName", user_data.firstName)
        if user_data.lastName:
            setattr(current_user, "lastName", user_data.lastName)
        if user_data.avatar:
            setattr(current_user, "avatar", user_data.avatar)
        if user_data.language:
            setattr(current_user, "language", user_data.language)
        if user_data.country:
            setattr(current_user, "country", user_data.country)
        if user_data.allowNotifications:
            setattr(current_user, "allowNotifications", user_data.allowNotifications)
        if user_data.defaultStartedPage:
            setattr(current_user, "defaultStartedPage", user_data.defaultStartedPage)
        if user_data.defaultArticleCategorie:
            setattr(
                current_user,
                "defaultArticleCategorie",
                user_data.defaultArticleCategorie,
            )

        db.commit()
        return current_user

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Database integrity error"
        )
    except Exception as e:
        print(e)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Internal server error"
        )
