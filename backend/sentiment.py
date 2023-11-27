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

# returns pos, neg, and neu sentiments for given text
def analyze_sentiment(text: str) -> dict[str, float]:
    processed = preprocess(text)
    sentiments = analyzer.polarity_scores(processed)
    del sentiments['compound']
    return sentiments


