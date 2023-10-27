import bcrypt
from sqlalchemy.exc import IntegrityError
from flask import request, make_response, Blueprint
import models
from dotenv import load_dotenv
import os
import jwt

load_dotenv()
SECRET = os.getenv('SECRET')

auth_bp = Blueprint('auth', 'auth')

# return hash for password
def hash_pw(plain_text: str):
    pw_bytes = plain_text.encode('utf-8')
    salt = bcrypt.gensalt()
    pw_hash = bcrypt.hashpw(pw_bytes, salt)

    return pw_hash

# validate hash against plaintext
def validate_pw(plain_text: str, pw_hash):
    pt_bytes = plain_text.encode('utf-8')
    return bcrypt.checkpw(pt_bytes, pw_hash.encode('utf-8'))

def make_jwt(name, role, id):
    encoded_jwt = jwt.encode({
        "name": name,
        "role": role,
        "id": id
    }, SECRET)

    return encoded_jwt

def decode_jwt(token):
    return jwt.decode(token, SECRET, algorithms=["HS256"])

# patient account creation
@auth_bp.route("/patient/register", methods=["POST"])
def patient_register():
    name = request.json['name']
    phone = request.json['phone']
    address = request.json['address']
    email = request.json['email']
    password_plaintext = request.json['password']

    pw_hash = hash_pw(password_plaintext)
    new_patient = models.Patient(name, phone, address, email, pw_hash)
    models.db.session.add(new_patient)
    
    try:
        models.db.session.commit()
        return {}, 200
    except IntegrityError:
        models.db.session.rollback()
        return {}, 401
    
# patient login
@auth_bp.route("/patient/login", methods=["POST"])
def patient_login():
    email = request.json['email']
    password_plaintext = request.json['password']
    
    user = models.Patient.query.filter_by(email=email).one()
    potential_user = models.patient_schema.dump(user)
    print(potential_user)
    valid = validate_pw(password_plaintext, potential_user['password_hash'])
    resp = make_response({})
    
    if valid:
        resp.status_code = 200
        token = make_jwt(potential_user['name'], "patient", potential_user['id'])
        resp.set_cookie('token', token)
    else:
        resp.status_code = 401

    return resp

