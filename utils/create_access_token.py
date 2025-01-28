from datetime import datetime, timedelta
from jose import jwt
from common.config import Config

def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)  # Expiration par défaut
    
    payload = {
        "exp": expire,          # Timestamp d'expiration
        "sub": str(subject),    # Subject (généralement l'ID/user email)
        "type": "access"        # Type de token
    }
    
    return jwt.encode(
        payload,
        Config.SECRET_KEY,    # Clé secrète lue depuis les variables d'environnement
        algorithm=Config.ALGORITHM
    )