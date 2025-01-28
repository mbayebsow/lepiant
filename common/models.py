from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum
from datetime import datetime
from .database import Base
import enum


class ModelMixin:
    def to_dict(self):
        result = {}
        # Get the SQLAlchemy mapped table from the instance
        mapper = getattr(self, "__mapper__", None)
        if mapper is None:
            return result

        for column in mapper.columns:
            value = getattr(self, column.name)
            if isinstance(value, datetime):
                value = value.isoformat()
            elif hasattr(value, "value"):  # Handle Enum values
                value = value.value
            result[column.name] = value
        return result


class StartAppEnum(enum.Enum):
    NEWS = "NEWS"
    RADIOS = "RADIOS"


class RoleEnum(enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    GUEST = "GUEST"


class User(Base, ModelMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String, unique=True, index=True)
    firstName = Column(String, nullable=False)
    lastName = Column(String, nullable=False)
    username = Column(String, unique=True, index=True)
    avatar = Column(
        String,
        default="https://ik.imagekit.io/7whoa8vo6/lepiant/avatars/a388a057fd087204dd4b5cd90b79f54c-sticker%201__Npxb9iIU.png",
    )
    language = Column(String, default="fr")
    country = Column(String, default="sn")
    isActive = Column(Boolean, default=True)
    allowNotifications = Column(Boolean, default=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.USER)
    createdAt = Column(DateTime, default="now()")
    updatedAt = Column(DateTime, default="now()", onupdate="now()")
    defaultStartedPage = Column(Enum(StartAppEnum), default=StartAppEnum.NEWS)
    defaultArticleCategorie = Column(Integer, default=1)
    password = Column(String)


class ArticleCategorie(Base, ModelMixin):
    __tablename__ = "article_categories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True, index=True)
    createdAt = Column(DateTime, default="now()")
    updatedAt = Column(DateTime, default="now()", onupdate="now()")


class Channel(Base, ModelMixin):
    __tablename__ = "channels"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True, index=True)
    logo = Column(String, nullable=False)
    fullLogo = Column(String, nullable=False)
    country = Column(String, nullable=False)
    language = Column(String, default="fr")
    isActive = Column(Boolean, default=True)
    createdAt = Column(DateTime, default="now()")
    updatedAt = Column(DateTime, default="now()", onupdate="now()")
    webSite = Column(String, nullable=False)


class Article(Base, ModelMixin):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    categorieId = Column(Integer, ForeignKey("article_categories.id"))
    channelId = Column(Integer, ForeignKey("channels.id"))
    title = Column(String, unique=True, index=True)
    image = Column(
        String,
        default="https://ik.imagekit.io/7whoa8vo6/lepiant/a6a6a6_text=L_27EPIANT_LxvtvPYyB",
    )
    description = Column(String, nullable=False)
    link = Column(String, unique=True, index=True)
    isActive = Column(Boolean, default=True)
    published = Column(DateTime, nullable=False)
    createdAt = Column(DateTime, default="now()")
    updatedAt = Column(DateTime, default="now()", onupdate="now()")


class ArticleSaved(Base, ModelMixin):
    __tablename__ = "articles_saved"

    userId = Column(Integer, ForeignKey("users.id"), primary_key=True)
    articleId = Column(Integer, ForeignKey("articles.id"), primary_key=True)
    createdAt = Column(DateTime, default="now()")


class ChannelSubscribed(Base, ModelMixin):
    __tablename__ = "channels_subscribed"

    userId = Column(Integer, ForeignKey("users.id"), primary_key=True)
    channelId = Column(Integer, ForeignKey("channels.id"), primary_key=True)
    createdAt = Column(DateTime, default="now()")


class RadioCategorie(Base, ModelMixin):
    __tablename__ = "radio_categories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    createdAt = Column(DateTime, default="now()")
    updatedAt = Column(DateTime, default="now()", onupdate="now()")


class Radio(Base, ModelMixin):
    __tablename__ = "radios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True, index=True)
    source = Column(String, nullable=False)
    image = Column(String, nullable=False)
    isActive = Column(Boolean, default=True)
    categorieId = Column(Integer, ForeignKey("radio_categories.id"))


class RadioLiked(Base, ModelMixin):
    __tablename__ = "radios_liked"

    userId = Column(Integer, ForeignKey("users.id"), primary_key=True)
    radioId = Column(Integer, ForeignKey("radios.id"), primary_key=True)
    createdAt = Column(DateTime, default="now()")


class Source(Base, ModelMixin):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    categorieId = Column(Integer, ForeignKey("article_categories.id"))
    channelId = Column(Integer, ForeignKey("channels.id"))
    url = Column(String, nullable=False)
    isActive = Column(Boolean, default=True)
    createdAt = Column(DateTime, default="now()")
    updatedAt = Column(DateTime, default="now()", onupdate="now()")
    language = Column(String, default="fr")


class Newspapers(Base, ModelMixin):
    __tablename__ = "newspapers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    createdAt = Column(DateTime, default="now()")
    images = Column(String, unique=True, nullable=False)
    publishedAt = Column(String, nullable=False)
    thumbnailUrl = Column(String, default="")


class PressReviews(Base, ModelMixin):
    __tablename__ = "press_reviews"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    createdAt = Column(DateTime, default="now()")
    audio = Column(String, nullable=False)
    name = Column(String, index=True)
    publishedAt = Column(String, nullable=False)


class ArticleShared(Base, ModelMixin):
    __tablename__ = "articles_shared"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    userId = Column(Integer, ForeignKey("users.id"))
    articleId = Column(Integer, ForeignKey("articles.id"))
    sharedAt = Column(DateTime, default="now()")
    sharedWith = Column(Integer, ForeignKey("users.id"))
    shareTo = Column(String, default="-")


class AccessKeys(Base, ModelMixin):
    __tablename__ = "acces_keys"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    userId = Column(Integer, ForeignKey("users.id"))
    token = Column(String, unique=True, index=True)
    additionalData = Column(String, nullable=True)
    lastActivity = Column(DateTime, nullable=True)
    createAt = Column(DateTime, nullable=False, default="now()")
    expireAt = Column(DateTime, nullable=True)
