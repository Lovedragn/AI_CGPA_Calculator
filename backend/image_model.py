import os
import base64
import requests

from RAG import run_pipeline
from dotenv import load_dotenv

load_dotenv()

def extract_text_from_image_mistral_api(image_bytes: bytes) -> str:
    
    api_key = os.getenv("MISTRAL_API_KEY")
            
    url = "https://api.mistral.ai/v1/ocr"
    
    # Base64 encode the image bytes
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")
    
    payload = {
        "model": "mistral-ocr-latest",
        "document": {
            "type": "image_url",
            "image_url": f"data:image/jpeg;base64,{image_base64}"
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    
    result = response.json()
    pages = result.get("pages", [])
    if not pages:
        return ""
        
    text = "\n".join(page.get("markdown", "") for page in pages)
    return text

def process_extracted_text_rag(text_data: str) -> dict:
    if not text_data:
        return {"error": "No text content found in JSON data."}
    return run_pipeline(text_data)

def image_starter(file_path):
    print("image started")
    with open(file_path, "rb") as f:
        image_bytes = f.read()
    json_data = extract_text_from_image_mistral_api(image_bytes)
    
    return process_extracted_text_rag(json_data) 
