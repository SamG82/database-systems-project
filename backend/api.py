from flask import request, Blueprint
from auth import protected_route
import models
from sqlalchemy.exc import IntegrityError
from datetime import datetime, date, timedelta

api_bp = Blueprint('api', 'api')

# Creates a hospital for an admin
@api_bp.route('/hospital', methods=['POST'])
@protected_route(['admin'])
def create_hospital(user_context):
    admin = models.Admin.query.get(user_context['id'])
    
    hospital_name = request.json.get('name', '')
    hospital_address = request.json.get('address', '')
    close_time = request.json.get('close_time', '')
    open_time = request.json.get('open_time', '')
    phone = request.json.get('phone', '')

    new_hospital = models.Hospital(
        hospital_name,
        hospital_address,
        close_time,
        open_time,
        phone
    )

    try:
        models.db.session.add(new_hospital)
        admin.hospital = new_hospital
        models.db.session.commit()
        return {}, 200
    except IntegrityError:
        models.db.session.rollback()
        return {}, 500

# creates a doctor for an admin's hospital
@api_bp.route('/doctor', methods=['POST'])
@protected_route(['admin'])
def create_doctor(user_context):
    admin = models.Admin.query.get_or_404(user_context['id'])
    doctor_name = request.json.get('name')
    doctor_specialization = request.json.get('specialization')
    new_doctor = models.Doctor(name=doctor_name, specialization=doctor_specialization)
    
    try:
        models.db.session.add(new_doctor)
        admin.hospital.doctors.append(new_doctor)
        models.db.session.commit()
        return {}, 200
    except IntegrityError:
        models.db.session.rollback()
        return {}, 500

# delete a doctor record
@api_bp.route('/doctor/<id>', methods=['DELETE'])
@protected_route(['admin'])
def delete_doctor(user_context, id):
    doctor = models.Doctor.query.get_or_404(id)
    admin = models.Admin.query.get(user_context['id'])
    
    if doctor in admin.hospital.doctors:
        models.db.session.delete(doctor)
        models.db.session.commit()
        return {}, 200
    else:
        return {}, 401

# change a doctor's availability status for admins
@api_bp.route('/doctor/<id>', methods=['PATCH'])
@protected_route(['admin'])
def update_doctor_availability(user_context, id):
    doctor = models.Doctor.query.get_or_404(id)
    admin = models.Admin.query.get(user_context['id'])

    if doctor in admin.hospital.doctors:
        doctor.available = request.json['availability']
        models.db.session.commit()
        return {}, 200
    else:
        return {}, 500

# gets a list of hospitals for patients
@api_bp.route('/hospitals', methods=['GET'])
@protected_route(['patient'])
def all_hospitals(user_context):
    hospitals = models.Hospital.query.all()
    hospitals_json = models.hospitals_schema.dump(hospitals)
    
    for i, hospital in enumerate(hospitals):
        hospitals_json[i]['doctors'] = models.doctors_schema.dump(hospital.doctors)

    return hospitals_json

# returns dashboard data for an admin
@api_bp.route('/dashboard', methods=['GET'])
@protected_route(['admin'])
def get_dashboard(user_context):
    admin = models.Admin.query.get_or_404(user_context['id'])
    doctors = []

    if admin.hospital:
        doctors = admin.hospital.doctors

    return {
        'hospital': models.hospital_schema.dump(admin.hospital),
        'doctors': models.doctors_schema.dump(doctors)
    }

# creates an appointment for a patient
@api_bp.route('/appointment', methods=['POST'])
@protected_route(['patient'])
def create_appointment(user_context):
    doctor_id = request.json.get('doctor_id', '')
    doctor = models.Doctor.query.get_or_404(doctor_id)

    start_input = request.json.get('start_time', '')
    end_input = request.json.get('end_time', '')

    start = datetime.strptime(start_input, '%H:%M')
    end = datetime.strptime(end_input, '%H:%M')
    date = request.json.get('date', '')

    patient_concerns = request.json.get('patient_concerns', '')
    appt = models.Appointment(
        start_time=start.time(),
        end_time=end.time(),
        date=datetime.strptime(date, '%Y-%m-%d').date(),
        patient_concerns=patient_concerns
    )
    
    patient = models.Patient.query.get_or_404(user_context['id'])

    patient.appointments.append(appt)
    doctor.appointments.append(appt)

    models.db.session.add(appt)
    models.db.session.commit()
    return {}, 200

# gets all appointments for a patient
@api_bp.route('/portal', methods=['GET'])
@protected_route(['patient'])
def patient_portal(user_context):
    patient = models.Patient.query.get_or_404(user_context['id'])
    appts = models.appointments_schema.dump(patient.appointments)
    for i, apt in enumerate(patient.appointments):
        doctor = models.Doctor.query.get(apt.doctor_id)
        appts[i]['doctor_name'] = doctor.name
        hospital = models.Hospital.query.get(doctor.hospital_id)
        appts[i]['hospital_name'] = hospital.name

    return {
        "name": patient.name,
        "appointments": appts
    }

# gets valid appointments time for a specific date and doctor
@api_bp.route('/appointment/times/<date>/<doctor_id>', methods=['GET'])
@protected_route(['patient'])
def get_valid_times(user_context, date, doctor_id):
    date = datetime.strptime(date, '%Y-%m-%d').date()
    doctor = models.Doctor.query.get(doctor_id)

    hospital = models.Hospital.query.get(doctor.hospital_id)
    appts_on_date = models.Appointment.query.filter_by(date=date).all()

    start = datetime.combine(date.today(), hospital.open_time)
    end = datetime.combine(date.today(), hospital.close_time)

    intervals = int((end-start) / timedelta(minutes=30))
    segments = [(start + timedelta(minutes=30*i),
                 (start + timedelta(minutes=30*(i + 1))))
                 for i in range(intervals)]
    taken_times = [appt.start_time for appt in appts_on_date]

    valid_times = []
    for seg in segments:
        if seg[0].time() not in taken_times:
            valid_time = {
                "start": str(seg[0].time()),
                "end": str(seg[1].time())
            }
            valid_times.append(valid_time)

    return valid_times