from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from common.config import Config

DATABASE_URL = Config.DATABASE_URL
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Ensure the URL starts with postgresql:// instead of postgres://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

try:
    engine = create_engine(
        DATABASE_URL,
        pool_size=20,
        max_overflow=10,
        pool_timeout=30,
        pool_pre_ping=True,
    )
    SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)
    Base = declarative_base()
except Exception as e:
    print(f"Error connecting to database: {e}")
    raise
