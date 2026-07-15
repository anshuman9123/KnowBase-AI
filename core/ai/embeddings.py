from langchain_openai import OpenAIEmbeddings
import os
from dotenv import load_dotenv
load_dotenv()

def get_embeddings():
    return OpenAIEmbeddings(
        model="text-embedding-3-small",
        openai_api_key=os.getenv("OPENAI_API_KEY")
    )
