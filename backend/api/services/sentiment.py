from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

analyzer = SentimentIntensityAnalyzer()

# returns preprocessed text for sentiment analysis
def preprocess(text: str) -> str:
    tokens = word_tokenize(text.lower())
    no_stops = [t for t in tokens if t not in stopwords.words('english')]
    lemmatizer = WordNetLemmatizer()
    l_tokens = [lemmatizer.lemmatize(tok) for tok in no_stops]

    return ' '.join(l_tokens)

# returns applies sentiment attribute to appointments dictionary, returns average scores
def analyze_sentiments(appointments: list[dict]) -> dict[str, float]:
    combined_sentiment = {
        'pos': 0,
        'neg': 0,
        'neu': 0
    }
    reviewed_total = 0
    for appointment in appointments:
        # get sentiment
        if appointment['patient_review'] == None:
            appointment['sentiment'] = None
            continue

        processed = preprocess(appointment['patient_review'])
        sentiment = analyzer.polarity_scores(processed)

        del sentiment['compound']

        # add the values to the combined score
        for category, value in sentiment.items():
            combined_sentiment[category] += value

        # apply sentiment attribute to the appointment
        appointment['sentiment'] = sentiment

        reviewed_total += 1

    # return before divide by 0 if there are no reviewed appointments
    if reviewed_total == 0:
        return combined_sentiment
    
    for category in combined_sentiment:
        combined_sentiment[category] /= reviewed_total

    return combined_sentiment

