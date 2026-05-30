import httpx
import json
OLLAMA_BASE_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "gemma3:4b"

async def chat_with_ollama(user_prompt: str):
    payload = {
        "model" : MODEL_NAME,
        "prompt" : user_prompt,
        "stream" : False
    }
    async with httpx.AsyncClient(timeout=None) as client:
        response = await client.post(
            OLLAMA_BASE_URL,
            json = payload,
            timeout=120
        )
        data = response.json()
        return data["response"]

    