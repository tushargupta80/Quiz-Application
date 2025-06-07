# services/auth_service.py
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from services.db_service import mongo_service
from config import Config
from bson.objectid import ObjectId # To work with MongoDB's ObjectId

users_collection = mongo_service.get_collection('users')

def register_user(email, password):
    """
    Registers a new user.
    Hashes the password and stores the user in the database.
    """
    # Basic validation
    if not email or not password:
        raise ValueError("Email and password are required.")
    if len(password) < 6: # Example minimum password length
        raise ValueError("Password must be at least 6 characters long.")

    # Check if user with this email already exists
    if users_collection.find_one({"email": email}):
        raise ValueError("User with this email already exists.")

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256') # Strong hashing

    user_data = {
        "email": email,
        "password": hashed_password,
        "created_at": datetime.datetime.now(datetime.timezone.utc)
    }

    # Insert new user into the 'users' collection
    insert_result = users_collection.insert_one(user_data)
    return str(insert_result.inserted_id) # Return the string ID of the new user


def login_user(email, password):
    """
    Authenticates a user.
    Verifies password, generates and returns a JWT token upon successful login.
    """
    # Basic validation
    if not email or not password:
        raise ValueError("Email and password are required.")

    user = users_collection.find_one({"email": email})

    if not user or not check_password_hash(user['password'], password):
        raise ValueError("Invalid email or password.")

    # Generate JWT token
    # Token payload: user_id and expiration time
    token_payload = {
        'user_id': str(user['_id']), # Convert ObjectId to string for JWT
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24) # Token valid for 24 hours
    }
    token = jwt.encode(
        token_payload,
        Config.SECRET_KEY,
        algorithm="HS256"
    )

    # Return the token and basic user info (without password hash)
    return token, {"id": str(user['_id']), "email": user['email']}