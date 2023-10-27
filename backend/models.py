from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
ma = Marshmallow()

class PatientSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'phone', 'email', 'password_hash')

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    phone = db.Column(db.Integer)
    address = db.Column(db.String(50))
    email = db.Column(db.String(25), unique=True)
    password_hash = db.Column(db.String(100))

    def __init__(self, name, phone, address, email, pw_hash):
        self.name = name
        self.phone = phone
        self.address = address
        self.email = email
        self.password_hash = pw_hash

patient_schema = PatientSchema()
patients_schema = PatientSchema(many=True)
