from flask import Blueprint
from .admin import admin_blueprint
from .hospital import hospital_blueprint
from .patient import patient_blueprint
from .doctor import doctor_blueprint
from.appointment import appointment_blueprint

api_blueprint = Blueprint('api', __name__, url_prefix='/api')
api_blueprint.register_blueprint(admin_blueprint)
api_blueprint.register_blueprint(hospital_blueprint)
api_blueprint.register_blueprint(patient_blueprint)
api_blueprint.register_blueprint(doctor_blueprint)
api_blueprint.register_blueprint(appointment_blueprint)