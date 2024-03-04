import speech_recognition as sr

def main():
    r = sr.Recognizer()
    #get key from google cloud
    service_account_json = "C:/Users/Kendall Eberly/Downloads/gemini.json"

    wav_file_path = "C:/Users/Kendall Eberly/Documents/Sound Recordings/Recording.wav"

    with sr.AudioFile(wav_file_path) as source:
        print('Processing audio file...')
        audio = r.record(source)
        print('Done!')
  
    try:
        text = r.recognize_google_cloud(
            audio_data=audio,
            credentials_json=service_account_json,
            preferred_phrases=None,
            show_all=False
        )
        print('You said: ' + text)
    except sr.UnknownValueError:
        print('Google Cloud Speech Recognition could not understand audio')
    except sr.RequestError as e:
        print('Could not request results from Google Cloud Speech Recognition service; {0}'.format(e))
    return text

if __name__ == "__main__":
    main()
