from flask import Blueprint, g
from api.schemas import validate_with
from api.schemas.hospital import HospitalCreate
from api.services.auth import protected_route
from api.utils import query_to_dict, execute_commit_error_check

hospital_blueprint = Blueprint('hospital', __name__, url_prefix='/hospital')

create_hospital_sql = 'INSERT INTO Hospital(name, address, appointment_length, open_time, close_time, phone, admin_id) VALUES(?,?,?,?,?,?,?)'
get_all_hospitals_sql = 'SELECT id, name, address, open_time, close_time, phone FROM Hospital'

# creates a hospital for an admin 
@hospital_blueprint.route('/create', methods=['POST'])
@protected_route(['admin'])
@validate_with(HospitalCreate)
def create_hospital(hospital_data, user_context):
    values = (hospital_data['name'], hospital_data['address'],
              hospital_data['appointment_length'],
              hospital_data['open_time'].strftime("%H:%M"),
              hospital_data['close_time'].strftime("%H:%M"),
              hospital_data['phone'], user_context['id'])

    return execute_commit_error_check(g.db, g.cursor, create_hospital_sql, values)

# gets a list of all hospitals for a patient
@hospital_blueprint.route('/', methods=['GET'])
@protected_route(['patient'])
def get_all_hospitals(user_context):
    return query_to_dict(g.cursor, get_all_hospitals_sql), 200

