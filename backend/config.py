import os
from dotenv import load_dotenv

# Load environment variables dynamically relative to this file
backend_dir = os.path.dirname(os.path.abspath(__file__))
prod_env_path = os.path.join(backend_dir, ".prod.env")
dev_env_path = os.path.join(backend_dir, ".dev.env")

load_dotenv(dev_env_path)
    
FLASK_PORT=os.getenv("FLASK_PORT")
UPLOAD_FOLDER=os.getenv("UPLOAD_FOLDER")
GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY")
GOOGLE_VISION_API_KEY=os.getenv("GOOGLE_VISION_API_KEY")
MISTRAL_API_KEY=os.getenv("MISTRAL_API_KEY")