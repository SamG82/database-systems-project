import bcrypt
from sqlalchemy.exc import IntegrityError
from flask import request, make_response, Blueprint
import models
from dotenv import load_dotenv
import os
import jwt
from functools import wraps

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

# create an auth token
def make_jwt(name, role, id):
    encoded_jwt = jwt.encode({
        'name': name,
        'role': role,
        'id': id
    }, SECRET)

    return encoded_jwt

# returns decoded token info, false if invalid
def decode_jwt(token):
    result = False
    
    try:
        result = jwt.decode(token, SECRET, algorithms=['HS256'])
    except:
        pass

    return result

# protected decorator for routes, passes user context to the route
def protected_route(roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = request.cookies.get('token')
            payload = decode_jwt(token)

            if payload and payload.get('role', None) in roles:
                return f(payload, *args, **kwargs)
            
            return {'message': 'Invalid Authentication'}, 401
        
        return wrapper
    
    return decorator

# user account creation
@auth_bp.route('/users/register', methods=['POST'])
def user_register():
    name = request.json.get('name', '')
    phone = request.json.get('phone', '')
    address = request.json.get('address', '')
    email = request.json.get('email', '')
    password_plaintext = request.json.get('password', '')

    user_role = request.json.get('role', '')
    pw_hash = hash_pw(password_plaintext)

    new_user = None
    if user_role == 'patient':
        new_user = models.Patient(name, phone, address, email, pw_hash)
    elif user_role == 'admin':
        new_user = models.Admin(name, address, email, pw_hash)
    else:
        return {}, 401
    
    models.db.session.add(new_user)
    
    try:
        models.db.session.commit()
        return {}, 200
    except IntegrityError:
        models.db.session.rollback()
        return {}, 401
    
# patient login
@auth_bp.route('/users/login', methods=['POST'])
def user_login():
    email = request.json.get('email', '')
    password_plaintext = request.json.get('password', '')
    user_role = request.json.get('role', '')

    user = None
    potential_user = None
    if user_role == 'patient':
        user = models.Patient.query.filter_by(email=email).one()
        potential_user = models.patient_schema.dump(user)
    elif user_role == 'admin':
        user = models.Admin.query.filter_by(email=email).one()
        potential_user = models.admin_schema.dump(user)
    else:
        return {}, 401
    
    valid = validate_pw(password_plaintext, potential_user['password_hash'])
    resp = make_response({})
    
    if valid:
        resp.status_code = 200
        token = make_jwt(potential_user['name'], user_role, potential_user['id'])
        resp.set_cookie('token', token, httponly=True)
    else:
        resp.status_code = 401

    return resp

@auth_bp.route('/users/logout', methods=['POST'])
def logout():
    resp = make_response({})
    resp.set_cookie('token', '', httponly=True)

    return resp