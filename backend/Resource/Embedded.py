import os
import json
import time
from dotenv import load_dotenv

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

# ==========================
# Load Environment
# ==========================
load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError(
        "GOOGLE_API_KEY environment variable is not set. "
        "Please add GOOGLE_API_KEY=your_api_key to your .env file."
    )

# ==========================
# Initialize Embedding Model
# ==========================

embedding_model = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=api_key,
)

# Monkey-patch to handle embedding API rate limits if they occur
original_embed_documents = embedding_model.embed_documents
def rate_limited_embed_documents(texts):
    retries = 5
    delay = 10
    for i in range(retries):
        try:
            return original_embed_documents(texts)
        except Exception as e:
            if "RESOURCE_EXHAUSTED" in str(e) or "429" in str(e):
                print(f"Rate limit hit. Retrying in {delay} seconds...")
                time.sleep(delay)
                delay += 10
            else:
                raise e
    raise RuntimeError("Failed to embed documents after multiple retries due to rate limits.")
object.__setattr__(embedding_model, 'embed_documents', rate_limited_embed_documents)


# ==========================
# Create FAISS Index
# ==========================
INDEX_PATH = "faiss_index"

def create_faiss_index():
    
    credits_file_path = "Resource/Credits.json"

    if not os.path.exists(credits_file_path):
        raise FileNotFoundError(f"Source file '{credits_file_path}' not found.")
        
    print(f"Loading data from '{credits_file_path}'...")
    with open(credits_file_path, 'r') as f:
        credits_data = json.load(f)
        
    print(f"Converting {len(credits_data)} JSON entries into LangChain documents...")
    
    documents = [
        Document(
            page_content=f"Subject Code: {entry['SUBJECT_CODE']}, Credits: {entry['CREDITS']}",
            metadata={"subject_code": entry['SUBJECT_CODE'], "credits": entry['CREDITS']}
        )
        for entry in credits_data
    ]

    # Index in batches of 50 to avoid embedding API rate limits or excessive load
    batch_size = 50
    first_batch_size = min(batch_size, len(documents))
    print(f"Indexing the first {first_batch_size} documents...")
    
    vector_db = FAISS.from_documents(
        documents[:batch_size],
        embedding_model,
    )

    for i in range(batch_size, len(documents), batch_size):
        batch = documents[i : i + batch_size]
        print(f"Indexing batch {i // batch_size + 1}/{(len(documents) + batch_size - 1) // batch_size}...")
        vector_db.add_documents(batch)
        time.sleep(5)  # Sleep to prevent API rate limits / high CPU load

    print(f"Saving FAISS index locally to '{INDEX_PATH}'...")
    vector_db.save_local(INDEX_PATH)
    print("FAISS database created successfully!")

if __name__ == "__main__":
    create_faiss_index()