from qdrant_client import QdrantClient
import os

def get_qdrant_client():
    return QdrantClient(
        url=os.getenv("QDRANT_URL"),
        api_key=os.getenv("QDRANT_API_KEY"),
        prefer_grpc=False,   # 🔴 IMPORTANT
        timeout=30
    )
