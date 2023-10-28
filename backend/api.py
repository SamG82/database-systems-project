from flask import request, make_response, Blueprint
from auth import protected_route
import models

api_bp = Blueprint('api', 'api')

"""
user = models.Patient.query.filter_by(email=email).one()
potential_user = models.patient_schema.dump(user)
"""

@api_bp.route('/hospital', methods=['POST'])
@protected_route(['admin'])
def create_hospital(user_context):
    admin = models.Admin.query.get(user_context['id'])
    print(models.admin_schema.dump(admin))

    return {}, 200