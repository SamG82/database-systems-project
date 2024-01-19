from flask import Flask, g, request, Response
from sqlite3 import connect
from flask_cors import CORS

from api.routes import api_blueprint

from db import setup_db

# configuration and setup
app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r'/api/*': {'origins': '*'}})

app.register_blueprint(api_blueprint)
setup_db()

# handle options preflight for development
@app.before_request
def handle_options_request():
    if request.method == 'OPTIONS':
        res = Response()
        res.headers['X-Content-Type-Options'] = '*'
        return res

@app.before_request
def connect_db():
    g.db = connect("./db.sqlite")
    g.cursor = g.db.cursor()
    
@app.teardown_request
def close_db(exception):
    if hasattr(g, 'db'):
        g.db.close()
