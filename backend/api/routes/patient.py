from flask import Blueprint, request, g
from api.services.auth import handle_login, handle_logout, handle_register, Role
from api.schemas.user import UserRegistration, UserLogin
from api.schemas import validate_with

patient_blueprint = Blueprint('patient', __name__, url_prefix='/patient')

create_patient_sql = 'INSERT INTO Patient(first_name, last_name, email, password_hash) VALUES(?,?,?,?)'    
find_patient_credentials_by_email = 'SELECT id, password_hash FROM Patient WHERE email=?'

# creates a patient account with a hashed password
@patient_blueprint.route('/create', methods=['POST'])
@validate_with(UserRegistration)
def create_patient(data):
    return handle_register(g.db, g.db.cursor(), data, create_patient_sql)

# logs in a patient and applies cookie token
@patient_blueprint.route('/login', methods=['POST'])
@validate_with(UserLogin)
def login_patient(login_data):
    return handle_login(g.db.cursor(), login_data, find_patient_credentials_by_email, Role.PATIENT)

@patient_blueprint.route('/logout', methods=['POST'])
def logout_patient():
    return handle_logout('patient', request)