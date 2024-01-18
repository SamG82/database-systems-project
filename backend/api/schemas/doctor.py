from marshmallow import Schema, fields, validate

# necessary request data for doctor creation
class DoctorCreate(Schema):
    first_name = fields.String(required=True, validate=validate.Length(1, 30))
    last_name = fields.String(required=True, validate=validate.Length(1, 30))
    specialization = fields.String(required=True, validate=validate.Length(1, 30))
    availability = fields.Boolean()