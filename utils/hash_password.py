import bcrypt

def hash_password(password: str) -> str:
    # Convert the password string to bytes
    password_bytes = password.encode('utf-8')
    # Generate salt and hash the password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    # Return the hash as a string
    return hashed.decode('utf-8')