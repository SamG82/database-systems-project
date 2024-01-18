from flask import Blueprint, g
from api.services.auth import protected_route
from api.schemas import validate_with
from api.schemas.appointment import AppointmentCreate, AppointmentReview
from api.utils import execute_commit_error_check, query_to_dict
import datetime
from api.services.sentiment import analyze_sentiments

appointment_blueprint = Blueprint('appointment', __name__, url_prefix='/appointment')

create_appointment_sql = '''
    INSERT INTO Appointment(doctor_id, patient_id, start_time, end_time, date, patient_concerns)
    VALUES(?,?,?,?,?,?)
'''

# update appointment if the id and patient_id match, and it hasn't already been reviewed
update_appointment_review_sql = '''
    UPDATE Appointment
    SET patient_review = ?, patient_satisfaction = ?
    WHERE id = ? AND patient_id = ? AND patient_review IS NULL AND patient_satisfaction IS NULL
'''

get_admins_appointments_sql = '''
    SELECT * FROM Appointment
    WHERE doctor_id IN
    (SELECT id FROM Doctor WHERE hospital_id
        = (SELECT id FROM Hospital WHERE admin_id = ?)
    )
'''

get_patients_appointments_sql = '''
    SELECT * FROM Appointment
    WHERE patient_id = ?
'''

get_valid_appointment_times_sql = '''
    WITH h AS (
        SELECT open_time, close_time, appointment_length 
        FROM Hospital 
        WHERE id = (SELECT hospital_id FROM Doctor WHERE id = ? AND availability=1)
    ),
    Times(start_time, end_time) AS (
        SELECT 
            strftime('%H:%M', open_time) AS start_time, 
            strftime('%H:%M', TIME(open_time, '+' || appointment_length || ' minutes')) AS end_time 
        FROM h
        UNION ALL
        SELECT 
            strftime('%H:%M', TIME(start_time, '+5 minutes')), 
            strftime('%H:%M', TIME(start_time, '+' || (appointment_length + 5) || ' minutes'))
        FROM Times, h 
        WHERE strftime('%s', end_time) < strftime('%s', close_time) 
    )
    SELECT start_time, end_time 
    FROM Times
    WHERE NOT EXISTS (
        SELECT 1 
        FROM Appointment
        WHERE date = ? 
        AND strftime('%s', Times.start_time) < strftime('%s', Appointment.end_time) 
        AND strftime('%s', Appointment.start_time) < strftime('%s', Times.end_time)
    );
'''

# create an appointment for a patient user
@appointment_blueprint.route('/create', methods=['POST'])
@protected_route(['patient'])
@validate_with(AppointmentCreate)
def create_appointment(appointment_data, user_context):
    values = (appointment_data['doctor_id'], user_context['id'],
              appointment_data['start_time'].strftime('%H:%M'), appointment_data['end_time'].strftime('%H:%M'),
              appointment_data['date'].strftime('%Y-%m-%d'), appointment_data['patient_concerns'])

    return execute_commit_error_check(g.db, g.cursor, create_appointment_sql, values)

# allow patient user to update an appointment with review
@appointment_blueprint.route('/review/<int:appointment_id>', methods=['PATCH'])
@protected_route(['patient'])
@validate_with(AppointmentReview)
def review_appointment(review_data, user_context, appointment_id):
    values = (review_data['patient_review'], review_data['patient_satisfaction'],
              appointment_id, user_context['id'])

    return execute_commit_error_check(g.db, g.cursor, update_appointment_review_sql, values)

# get admin's or patient's appointments depending on which type the user is
@appointment_blueprint.route('/', methods=['GET'])
@protected_route(['patient', 'admin'])
def get_users_appointments(user_context):

    # get admin's hospital's appointments with sentiment scores if the user is an admin
    if user_context['role'] == 'admin':
        appointments_list = query_to_dict(g.cursor, get_admins_appointments_sql, (user_context['id'],))

        combined_score = analyze_sentiments(appointments_list)
        return {
            'combined': combined_score,
            'appointments': appointments_list
        }
    
    # get patient's appointments if the user is a patient
    elif user_context['role'] == 'patient':
        return query_to_dict(g.cursor, get_patients_appointments_sql, (user_context['id'],)), 200
    
    return {}, 400

# get a list of valid times for a new appointment
@appointment_blueprint.route('/times/<int:doctor_id>/<string:date>', methods=['GET'])
@protected_route(['patient'])
def get_valid_times(user_context, doctor_id, date):
    try:
        datetime.date.fromisoformat(date)
    except ValueError:
        return {'error': 'Date should be YYYY-MM-DD'}, 400
    
    return query_to_dict(g.cursor, get_valid_appointment_times_sql, (doctor_id, date)), 200