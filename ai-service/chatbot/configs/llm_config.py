from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
import os

# Load environment variables
load_dotenv()

def create_model():
    """Create and return a configured Gemini model instance."""
    model = ChatGoogleGenerativeAI(
        model=os.getenv("MODEL_NAME", "gemini-1.5-flash"),
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=float(os.getenv("MODEL_TEMPERATURE", "0.7"))
    )
    return model

def get_system_message():
    """Get the system message from environment variables."""
    return os.getenv("SYSTEM_MESSAGE", "You are a helpful AI assistant.")