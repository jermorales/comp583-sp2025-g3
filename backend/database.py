import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/healthcare')
DB_NAME = os.getenv('DB_NAME', 'healthcare')

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

def get_database():
    return db 