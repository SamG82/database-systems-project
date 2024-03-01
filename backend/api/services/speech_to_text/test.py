import speech_recognition as sr

def main():
    r = sr.Recognizer()
    #get key from google cloud
    service_account_json = "C:/Users/Kendall Eberly/Downloads/integral-hold-415920-796939893651.json"

    # obtain audio from the microphone
    with sr.Microphone() as source:
        print('Say something...')
        audio = r.listen(source)
        print('Done!')

    # recognize speech using Google Cloud Speech
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

if __name__ == "__main__":
    main()
