# routes/auth_routes.py
from flask import Blueprint, request, jsonify
from services.auth_service import register_user, login_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """
    API endpoint for user registration.
    Expects JSON with 'email' and 'password'.
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    try:
        user_id = register_user(email, password)
        return jsonify({'message': 'User registered successfully!', 'user_id': user_id}), 201 # Created
    except ValueError as e:
        return jsonify({'error': str(e)}), 400 # Bad Request or Conflict if user exists
    except Exception as e:
        print(f"Error during signup: {e}") # Log the full error for debugging
        return jsonify({'error': 'An unexpected error occurred during registration.'}), 500 # Internal Server Error

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    API endpoint for user login.
    Expects JSON with 'email' and 'password'.
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    try:
        token, user_data = login_user(email, password)
        return jsonify({'message': 'Login successful!', 'token': token, 'user': user_data}), 200 # OK
    except ValueError as e:
        return jsonify({'error': str(e)}), 401 # Unauthorized (invalid credentials)
    except Exception as e:
        print(f"Error during login: {e}") # Log the full error for debugging
        return jsonify({'error': 'An unexpected error occurred during login.'}), 500 # Internal Server Error