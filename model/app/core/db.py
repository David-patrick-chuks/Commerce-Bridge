import os
from pymongo import MongoClient
from dotenv import load_dotenv
from app.core.config import settings

# Name of the MongoDB Atlas vector index for the embedding field
VECTOR_INDEX_NAME = "product_embedding_vector_index"  # Used for Atlas $vectorSearch aggregation

load_dotenv()

_client = None
_db = None
_products_col = None

def get_db():
    global _client, _db
    if _db is None:
        _client = MongoClient(settings.MONGO_URI)
        _db = _client[settings.MONGO_DB]
    return _db

def get_products_collection():
    global _products_col
    if _products_col is None:
        db = get_db()
        _products_col = db[settings.MONGO_COLLECTION]
    return _products_col 