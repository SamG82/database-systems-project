from marshmallow import Schema, fields, validate

# necessary request data for hospital creation 
class HospitalCreate(Schema):
    name = fields.String(required=True, validate=validate.Length(min=3, max=25))
    address = fields.String(required=True,validate=validate.Length(min=3, max=40))
    appointment_length = fields.Integer(required=True, validate=validate.Range(10, 60))
    open_time = fields.Time(required=True,format='%H:%M')
    close_time = fields.Time(required=True,format='%H:%M')
    phone = fields.Integer(required=True)