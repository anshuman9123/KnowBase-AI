import os
from langchain_community.vectorstores import FAISS

VECTOR_DB_PATH = "data/vector_store"

def save_vectors(docs, embeddings):
    os.makedirs(VECTOR_DB_PATH, exist_ok=True)

    db = FAISS.from_documents(docs, embeddings)
    db.save_local(VECTOR_DB_PATH)

    return db