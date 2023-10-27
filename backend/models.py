from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
ma = Marshmallow()

class PatientSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'phone', 'email', 'password_hash')

class Patient(db.Model):
    __tablename__ = 'patient'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    phone = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(25), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)

    def __init__(self, name, phone, address, email, pw_hash):
        self.name = name
        self.phone = phone
        self.address = address
        self.email = email
        self.password_hash = pw_hash

patient_schema = PatientSchema()
patients_schema = PatientSchema(many=True)

class HospitalSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'address', 'close_time', 'open_time', 'phone')

class Hospital(db.Model):
    __tablename__ = 'hospital'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    address = db.Column(db.String(50), unique=True, nullable=False)
    close_time = db.Column(db.String(20), nullable=False)
    open_time = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.Integer, unique=True, nullable=False)

hospital_schema = HospitalSchema()
hospitals_schema = HospitalSchema(many=True)

class AdminSchema(ma.Schema):
    class Meta:
        fields = ('id', 'hospital_id', 'name', 'address', 'email', 'password_hash')

class Admin(db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.Integer, primary_key=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospital.id'))
    hospital = db.relationship('Hospital', uselist=False, backref='admin')
    name = db.Column(db.String(30), nullable=False)
    address = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(25), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)

    def __init__(self, name, address, email, pw_hash):
        self.name = name
        self.address = address
        self.email = email
        self.password_hash = pw_hash

admin_schema = AdminSchema()
admins_schema = AdminSchema(many=True)
