from flask import Flask, g
from sqlite3 import connect
from flask_cors import CORS

from api.routes import api_blueprint

from db import setup_db

# configuration and setup
app = Flask(__name__)
CORS(app, supports_credentials=True)

app.register_blueprint(api_blueprint)
setup_db()

@app.before_request
def connect_db():
    g.db = connect("./db.sqlite")
    g.cursor = g.db.cursor()
    
@app.teardown_request
def close_db(exception):
    if hasattr(g, 'db'):
        g.db.close()
