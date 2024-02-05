import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv('gemini_api_key')

genai.configure(api_key=API_KEY)
gen_config = genai.GenerationConfig(
    candidate_count=1,
    stop_sequences=['.'],
    top_p = 0.7,
    top_k = 4,
    temperature=0)


model = genai.GenerativeModel('gemini-pro')

PROMPT_BASE = '''Your role is to function as a translation layer between everyday language 
                and medical terminology. When a user inputs a description of their symptoms, 
                you will convert this description into the precise medical terms used by healthcare professionals. 
                Your responses should be concise and focused solely on the translation of these symptoms: '''


def get_symptoms_suggestions(symptoms_text: str) -> str:
    prompt = PROMPT_BASE + symptoms_text
    response = model.generate_content(prompt, generation_config=gen_config)

    return response.text
