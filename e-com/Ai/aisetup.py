from google import genai
from fastapi.routing import APIRouter
from config import GEMINI_API_KEY



client = genai.Client(api_key=GEMINI_API_KEY)


def gemini_response(prompt):
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )
    return response.text



