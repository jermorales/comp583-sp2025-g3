from passlib.context import CryptContext
from database import get_database

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
db = get_database()

users_collection = db["users"]

def get_user_by_email_or_username(identifier):
    return users_collection.find_one({
        "$or": [
            {"email": identifier},
            {"name": identifier}
        ]
    })

def create_user(email, username, password):
    hashed_password = pwd_context.hash(password)
    user = {
        "email": email,
        "name": username,
        "password": hashed_password,
        "role": "patient",
        "is_active": True
    }
    users_collection.insert_one(user)
    return user

def authenticate_user(identifier, password):
    user = get_user_by_email_or_username(identifier)
    if user and pwd_context.verify(password, user["password"]):
        return user
    return None