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
    
# returns dashboard data for an admin
@api_bp.route('/dashboard', methods=['GET'])
@protected_route(['admin'])
def get_dashboard(user_context):
    admin = models.Admin.query.get_or_404(user_context['id'])

    return {
        'hospital': models.hospital_schema.dump(admin.hospital)
    }