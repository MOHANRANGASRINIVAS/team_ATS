from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def get_database() -> AsyncIOMotorClient:
    return db.client

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    print("Connected to MongoDB Atlas")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Disconnected from MongoDB Atlas") 