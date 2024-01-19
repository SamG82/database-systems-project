from enum import Enum
from functools import wraps
from sqlite3 import IntegrityError
from flask import request, Blueprint, make_response
from dotenv import load_dotenv
import os
import jwt
import bcrypt

load_dotenv()
SECRET = os.getenv('SECRET')

auth_bp = Blueprint('auth', 'auth')

credential_error = {
    'errors': {
        'credentials': [
            'Invalid email or password.'
        ]
    }
}

class Role(Enum):
    ADMIN = 'admin'
    PATIENT = 'patient'

# return hash for password
def hash_pw(plain_text: str):
    pw_bytes = plain_text.encode('utf-8')
    salt = bcrypt.gensalt()
    pw_hash = bcrypt.hashpw(pw_bytes, salt)

    return pw_hash

# validate hash against plaintext
def validate_pw(plain_text: str, pw_hash):
    pt_bytes = plain_text.encode('utf-8')
    return bcrypt.checkpw(pt_bytes, pw_hash)

# create an auth token: jwt containing a dict with role and id keys
def make_jwt(role: Role, id):
    encoded_jwt = jwt.encode({
        'role': role.value,
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

# flexibly handles reusable registration logic for routes
def handle_register(db, cursor, request_json, create_sql):
    hashed_pw = hash_pw(request_json['password'])

    values = (request_json['first_name'], request_json['last_name'], request_json['email'], hashed_pw)
    try:
        cursor.execute(create_sql, values)
        db.commit()
    except IntegrityError as e:
        if e.sqlite_errorname == "SQLITE_CONSTRAINT_UNIQUE":
            return {'errors': {'email': 'Email already in use.'}}, 400
        else:
            return {}, 500
        
    return {}, 200

# flexibly handles reusable login logic for routes 
def handle_login(cursor, request_json, find_credentials_sql, role: Role):
    res = cursor.execute(find_credentials_sql, (request_json['email'],))
    user = res.fetchone()
    if user == None:
        return credential_error, 401

    id, password = user
    if not validate_pw(request_json['password'], password):
        return credential_error, 401
    
    # apply the cookie if a user was found by email with the correct password
    resp = make_response({})
    resp.set_cookie('token', make_jwt(role, id), httponly=True)
    resp.status_code = 200

    return resp

# applies authentication to the decorated route handler based on the supplied list of roles
# checks for valid token
def protected_route(roles: list[Role]):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = request.cookies.get('token')
            payload = decode_jwt(token)

            if payload and payload.get('role', None) in roles:
                return f(payload, *args, **kwargs)
            
            return {'message': 'Invalid authentication'}, 401
        
        return wrapper
    
    return decorator
