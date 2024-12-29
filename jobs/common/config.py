import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    PRESS_REVIEW_PATH = os.getenv('PRESS_REVIEW_PATH')
    NEWSPAPER_PATH = os.getenv('NEWSPAPER_PATH')
    IMAGEKIT_ENDPOINT = os.getenv('IMAGEKIT_ENDPOINT')
    IMAGEKIT_PUBLIC_KEY = os.getenv('IMAGEKIT_PUBLIC_KEY')
    IMAGEKIT_PRIVATE_KEY = os.getenv('IMAGEKIT_PRIVATE_KEY')
    DATABASE_URL = os.getenv('DATABASE_URL')
    REDIS_URL = os.getenv('REDIS_URL')
    REDIS_HOST = os.getenv('REDIS_HOST')
    REDIS_PORT = os.getenv('REDIS_PORT')
    REDIS_SSL = os.getenv('REDIS_SSL')
    REDIS_USERNAME = os.getenv('REDIS_USERNAME')
    REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET')
    CLOUDINARY_NAME = os.getenv('CLOUDINARY_NAME')
    CRONITOR_API_KEY = os.getenv('CRONITOR_API_KEY')