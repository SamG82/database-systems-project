from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from datetime import datetime

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
    appointments = db.relationship('Appointment', uselist=True, backref='Patient')

    def __init__(self, name, phone, address, email, pw_hash):
        self.name = name
        self.phone = phone
        self.address = address
        self.email = email
        self.password_hash = pw_hash

patient_schema = PatientSchema()
patients_schema = PatientSchema(many=True)

class DoctorSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'specialization', 'available')

class Doctor(db.Model):
    __tablename__ = 'doctor'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False, unique=True)
    specialization = db.Column(db.String(30), nullable=False)
    available = db.Column(db.Boolean(), default=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospital.id'))
    appointments = db.relationship('Appointment', uselist=True, backref='Doctor', cascade='all, delete-orphan')

doctor_schema = DoctorSchema()
doctors_schema = DoctorSchema(many=True)

class HospitalSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'address', 'close_time', 'open_time', 'phone')

class Hospital(db.Model):
    __tablename__ = 'hospital'
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin.id'))
    name = db.Column(db.String(50), unique=True, nullable=False)
    address = db.Column(db.String(50), unique=True, nullable=False)
    close_time = db.Column(db.Time, nullable=False)
    open_time = db.Column(db.Time, nullable=False)
    phone = db.Column(db.Integer, unique=True, nullable=False)
    doctors = db.relationship('Doctor', uselist=True, backref='admin')
    def __init__(self, name, address, close_time, open_time, phone):
        self.name = name
        self.address = address
        self.close_time = datetime.strptime(close_time, '%H:%M').time()
        self.open_time = datetime.strptime(open_time, '%H:%M').time()
        self.phone = phone

hospital_schema = HospitalSchema()
hospitals_schema = HospitalSchema(many=True)

class AdminSchema(ma.Schema):
    class Meta:
        fields = ('id', 'hospital_id', 'name', 'address', 'email', 'password_hash')

class Admin(db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.Integer, primary_key=True)
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

class AppointmentSchema(ma.Schema):
    class Meta:
        fields = (
            'id',
            'doctor_id',
            'patient_id',
            'start_time',
            'end_time',
            'date',
            'patient_concerns',
            'patient_review',
            'patient_satisfaction'
        )

class Appointment(db.Model):
    __tablename__ = 'appointment'
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'))
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    date = db.Column(db.Date, nullable=False)
    patient_concerns = db.Column(db.String(150))
    patient_review = db.Column(db.String(150))
    patient_satisfaction = db.Column(db.Integer)
    
appointment_schema = AppointmentSchema()
appointments_schema = AppointmentSchema(many=True)
