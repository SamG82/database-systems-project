from flask import Blueprint, g
from api.services.auth import protected_route
from api.schemas import validate_with
from api.schemas.doctor import DoctorCreate
from api.utils import query_to_dict, execute_commit_error_check

doctor_blueprint = Blueprint('doctor', __name__, url_prefix='/doctor')

get_admins_hospital_id = 'SELECT id FROM Hospital WHERE admin_id=?'
create_doctor_sql = 'INSERT INTO Doctor(first_name, last_name, specialization, hospital_id) VALUES(?,?,?,?)'
update_doctor_availability_sql = '''
    UPDATE Doctor SET availability = ((availability | 1) - (availability & 1))
    WHERE id = ?
    AND hospital_id
    IN (SELECT id FROM Hospital WHERE admin_id=?)
'''
delete_doctor_sql = '''
    DELETE FROM Doctor
    WHERE id = ? 
    AND hospital_id
    IN (SELECT id FROM Hospital WHERE admin_id=?)
'''
get_admin_doctors_sql = '''
    SELECT id, first_name, last_name, specialization, availability FROM Doctor
    WHERE hospital_id IN (SELECT id FROM Hospital WHERE admin_id=?)
'''
get_available_doctors_sql = '''
    SELECT id, first_name, last_name, specialization FROM Doctor
    WHERE hospital_id = ? AND availability = 1
'''

# creates a doctor for a logged in admin's hospital
@doctor_blueprint.route('/create', methods=['POST'])
@protected_route(['admin'])
@validate_with(DoctorCreate)
def create_doctor(data, user_context):
    res = g.cursor.execute(get_admins_hospital_id, (user_context['id'],))
    values = (data['first_name'], data['last_name'], data['specialization'], res.fetchone()[0])

    return execute_commit_error_check(g.db, g.cursor, create_doctor_sql, values)

# flips the availability boolean on an admin's hospital's doctor
@doctor_blueprint.route('/update-availability/<int:doctor_id>', methods=['PATCH'])
@protected_route(['admin'])
def update_doctor_availability(user_context, doctor_id):
    g.cursor.execute(update_doctor_availability_sql, (doctor_id, user_context['id']))
    g.db.commit()

    return {}, 200

# deletes a doctor for the logged in admin's hospital
@doctor_blueprint.route('/delete/<int:doctor_id>', methods=['DELETE'])
@protected_route(['admin'])
def delete_doctor(user_context, doctor_id):
    g.cursor.execute(delete_doctor_sql, (doctor_id, user_context['id']))
    g.db.commit()

    return {}, 200

# gets a list of all admin's doctors
@doctor_blueprint.route('/', methods=['GET'])
@protected_route(['admin'])
def get_admins_doctors(user_context):
    return query_to_dict(g.cursor, get_admin_doctors_sql, (user_context['id'],)), 200

# gets all available doctors for a given hospital - used by patients not admins
@doctor_blueprint.route('/available/<int:hospital_id>', methods=['GET'])
@protected_route(['patient'])
def available_doctors_for_hospital(user_context, hospital_id):
    return query_to_dict(g.cursor, get_available_doctors_sql, (hospital_id,)), 200
