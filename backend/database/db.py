"""
MongoDB connection management using Motor (async driver).
"""
from motor.motor_asyncio import AsyncIOMotorClient
from database.config import settings


class Database:
    client: AsyncIOMotorClient = None
    db = None


database = Database()


async def connect_to_mongo():
    """Initialize MongoDB connection on app startup."""
    database.client = AsyncIOMotorClient(settings.mongo_uri)
    database.db = database.client[settings.mongo_db_name]
    # Create indexes for performance and uniqueness
    await database.db.users.create_index("email", unique=True)
    await database.db.detections.create_index("user_id")
    await database.db.reports.create_index("user_id")
    print("✅ Connected to MongoDB Atlas")


async def close_mongo_connection():
    """Close MongoDB connection on app shutdown."""
    if database.client:
        database.client.close()
        print("🔌 MongoDB connection closed")


def get_database():
    """Dependency to access the database in routers/services."""
    return database.db
