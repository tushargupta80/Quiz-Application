# services/db_service.py
from pymongo import MongoClient
from config import Config

class MongoDBService:
    _instance = None # Singleton instance variable

    def __new__(cls):
        # This ensures only one instance of MongoDBService is created
        if cls._instance is None:
            cls._instance = super(MongoDBService, cls).__new__(cls)
            try:
                cls._instance.client = MongoClient(Config.MONGO_URI)
                # Get the database name from the URI or use a default
                db_name = Config.MONGO_URI.split('/')[-1].split('?')[0] # Extracts db name from URI
                cls._instance.db = cls._instance.client.get_database(db_name)
                print(f"MongoDB connected to: {Config.MONGO_URI} (Database: {db_name})")
            except Exception as e:
                print(f"Error connecting to MongoDB: {e}")
                # You might want to raise an exception or exit here if DB connection is critical
                raise ConnectionError(f"Could not connect to MongoDB at {Config.MONGO_URI}. Is it running?") from e
        return cls._instance

    def get_db(self):
        """Returns the current database instance."""
        return self.db

    def get_collection(self, collection_name):
        """Returns a specific collection from the database."""
        return self.db[collection_name]

# Initialize a global instance of the MongoDB service.
# This instance will be shared across all modules that import it.
mongo_service = MongoDBService()