from marshmallow import Schema, fields, validate

# necessary request data for appointment creation
class AppointmentCreate(Schema):
    doctor_id = fields.Integer(required=True)
    start_time = fields.Time(required=True,format='%H:%M')
    end_time = fields.Time(required=True,format='%H:%M')
    date = fields.Date(required=True, format='%Y-%m-%d')
    patient_symptoms = fields.String(required=True, validate=validate.Length(max=500))

# necessary request data for an appointment's review
class AppointmentReview(Schema):
    patient_review = fields.String(required=True, validate=validate.Length(max=150))
    patient_satisfaction = fields.Integer(required=True, validate=validate.Range(1, 5))

