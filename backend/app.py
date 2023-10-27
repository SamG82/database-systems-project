from flask import Flask
import models
import os
from auth import auth_bp

# configuration and setup
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
models.db.init_app(app)

with app.app_context():
    models.db.create_all()

models.ma.init_app(app)

app.register_blueprint(auth_bp)

@app.route("/patients", methods=["GET"])
def patients():
    all_patients = models.Patient.query.all()
    results = models.patients_schema.dump(all_patients)
    return results