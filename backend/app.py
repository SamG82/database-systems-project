from flask import Flask
from flask_cors import CORS
import models
import os
from auth import auth_bp
from api import api_bp

# configuration and setup
app = Flask(__name__)
CORS(app, supports_credentials=True)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
models.db.init_app(app)

# reset databse on startup - debug
with app.app_context():
    models.db.drop_all()
    models.db.create_all()

models.ma.init_app(app)

app.register_blueprint(auth_bp)
app.register_blueprint(api_bp)

# routes for testing
@app.route('/patients', methods=['GET'])
def patients():
    all_patients = models.Patient.query.all()
    results = models.patients_schema.dump(all_patients)
    return results

@app.route('/admins', methods=['GET'])
def admins():
    all_admins = models.Admin.query.all()
    results = models.admins_schema.dump(all_admins)
    return results