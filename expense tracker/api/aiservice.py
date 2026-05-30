from config import settings
import google.generativeai as genai


genai.configure(
    api_key =settings.GEMINI_API_KEY 
    

)

# Use the correct Gemini model name
# Options: 'gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash'
model = genai.GenerativeModel('gemini-1.5-flash')

def get_ai_response(prompt:str):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error generating AI response: {e}")
        return "Sorry, I couldn't process your request at the moment. Please try again."