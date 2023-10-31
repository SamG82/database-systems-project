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