import speech_recognition as sr
from io import BytesIO

service_account_json = './api/services/gemini.json'

recognizer = sr.Recognizer()

# transcribes a FileStorage audio file
def transcribe(file_storage_obj):
    bytes_data = file_storage_obj.stream.read()

    converted = BytesIO(bytes_data)

    audio_file = sr.AudioFile(converted)
    with audio_file as audio_source:
        audio = recognizer.record(audio_source)

    text = recognizer.recognize_google_cloud(
        audio_data=audio,
        credentials_json=service_account_json
    )
    print(text)
    return text