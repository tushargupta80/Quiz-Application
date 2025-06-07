# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS # For handling Cross-Origin Resource Sharing
from config import Config
from routes.auth_routes import auth_bp
from routes.quiz_routes import quiz_bp
from services.db_service import mongo_service # Import to initialize MongoDB connection

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config) # Load configurations from Config class

    # Initialize Flask-CORS to allow cross-origin requests from your frontend.
    # In production, replace "*" with your frontend's exact domain (e.g., "https://yourfrontend.com").
    CORS(app, resources={r"/api/*": {"origins": "*"}}) 

    # Initialize MongoDB Service (this will connect to the DB)
    try:
        # Attempt a simple DB command to verify connection
        mongo_service.get_db().command('ping')
        print("Successfully connected to MongoDB!")
    except Exception as e:
        print(f"ERROR: Could not connect to MongoDB. Please check if MongoDB is running and MONGO_URI is correct in .env. Details: {e}")
        # In a real application, you might want to exit or raise a critical error here.

    # Register Blueprints
    # Blueprints organize your routes into modular components.
    app.register_blueprint(auth_bp, url_prefix='/api/auth') # Auth routes will be under /api/auth
    app.register_blueprint(quiz_bp, url_prefix='/api/quiz') # Quiz routes will be under /api/quiz

    # --- Global Error Handlers ---
    @app.errorhandler(404)
    def not_found(error):
        """Handles 404 Not Found errors."""
        return jsonify({'error': 'Not Found', 'message': 'The requested URL was not found on the server.'}), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        """Handles 405 Method Not Allowed errors."""
        return jsonify({'error': 'Method Not Allowed', 'message': f'The method {request.method} is not allowed for the requested URL.'}), 405

    @app.errorhandler(500)
    def internal_server_error(error):
        """Handles 500 Internal Server Errors."""
        # For debugging, you might want to print error or use a logger
        print(f"Unhandled server error: {error}")
        return jsonify({'error': 'Internal Server Error', 'message': 'An unexpected error occurred on the server.'}), 500

    # --- Health Check Route ---
    @app.route('/')
    def health_check():
        """Simple health check endpoint."""
        return jsonify({'status': 'AI Quiz Generator Backend is running!'}), 200

    return app

# Create the Flask application instance
app = create_app()

if __name__ == '__main__':
    # Run the Flask development server
    # debug=True automatically reloads the server on code changes and provides a debugger
    # In production, use a production-ready WSGI server like Gunicorn or uWSGI
    app.run(debug=True, host='0.0.0.0', port=5000) # Listen on all interfaces, port 5000