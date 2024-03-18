import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv('gemini_api_key')

genai.configure(api_key=API_KEY)
gen_config = genai.GenerationConfig(temperature=0)


model = genai.GenerativeModel('gemini-pro')

PROMPT_BASE = '''Your role is to function as a translation layer between everyday language and medical terminology.
                When a user inputs a description of their symptoms, you will convert this description into a list medical terms with their description in key-value form.
                Your responses should be a concise list and focused solely on the translation of this description, not a diagnosis: '''

def get_symptoms_suggestions(symptoms_text: str) -> list[str]:
    prompt = PROMPT_BASE + symptoms_text
    response = model.generate_content(prompt, generation_config=gen_config)

    return response.text.replace('\n', ' ').replace('- ', '').replace('*', '')
