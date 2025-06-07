# config.py
import os
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'a_default_secret_key_for_development_only') # Fallback for development if .env fails
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/aigenerator_db_default') # Fallback URI
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

    # Flask-specific configurations
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # Max PDF upload size: 16 MB
    UPLOAD_FOLDER = 'uploads' # Directory for temporary file storage (not used for production)
    ALLOWED_EXTENSIONS = {'pdf'} # Allowed file extensions for upload