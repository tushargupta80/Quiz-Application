# utils/auth_middleware.py
import jwt
from functools import wraps
from flask import request, jsonify
from config import Config
from services.db_service import mongo_service # To fetch user from DB

def token_required(f):
    """
    Decorator to protect API routes, requiring a valid JWT token.
    It extracts the token from the Authorization header, decodes it,
    and passes the current user object to the decorated function.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check for 'Authorization: Bearer <token>' header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'error': 'Authentication token is missing!'}), 401 # Unauthorized

        try:
            # Decode the token using the secret key
            # 'options={"verify_signature": False}' could be used for debugging, but security risk
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            user_id = data.get('user_id')

            if not user_id:
                raise jwt.InvalidTokenError("Token missing user_id.")

            # Fetch the current user from the database
            users_collection = mongo_service.get_collection('users')
            from bson.objectid import ObjectId # Import here to avoid circular dependency
            current_user = users_collection.find_one({"_id": ObjectId(user_id)})

            if not current_user:
                return jsonify({'error': 'User not found in database.'}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Authentication token has expired!'}), 401
        except jwt.InvalidTokenError as e:
            print(f"Invalid token error: {e}")
            return jsonify({'error': 'Authentication token is invalid.'}), 401
        except Exception as e:
            print(f"Server error during token verification: {e}")
            return jsonify({'error': 'Authentication failed due to an internal error.'}), 500

        # Pass the current_user object to the decorated route function
        return f(current_user, *args, **kwargs)

    return decorated