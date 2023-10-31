from flask import request, Blueprint
from auth import protected_route
import models
from sqlalchemy.exc import IntegrityError

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

# gets list of doctors for a hospital
@api_bp.route('/doctor', methods=['GET'])
@protected_route(['admin', 'patient'])
def get_doctors(user_context):
    if user_context['role'] == 'admin':
        admin = models.Admin.query.get_or_404(user_context['id'])
        doctors = models.doctors_schema.dump(admin.hospital.doctors)
        return {'doctors': doctors}, 200
    elif user_context['role'] == 'patient':
        hospital_id = request.json.get('hospital_id')
        hospital = models.Hospital.query.get(hospital_id)
        return models.doctors_schema.dump(hospital.doctors)
    
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