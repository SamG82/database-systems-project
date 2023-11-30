from flask import Flask
from flask_cors import CORS
import models
import os
from auth import auth_bp
from api import api_bp
from fabricate import fabricate_data

# configuration and setup
app = Flask(__name__)
CORS(app, supports_credentials=True)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
models.db.init_app(app)

with app.app_context():
    models.db.drop_all()
    models.db.create_all()
    fabricate_data()
    
models.ma.init_app(app)

app.register_blueprint(auth_bp)
app.register_blueprint(api_bp)
