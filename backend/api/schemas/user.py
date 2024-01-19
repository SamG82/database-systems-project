from marshmallow import Schema, fields, validate

# >= 8 characters long, at least one letter, one number, one special character
PASSWORD_REGEX = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'
PASSWORD_ERROR_SMG = 'Password must be at least 8 characters and contain one letter, number, and special character'

# basic email, password credentials
class UserLogin(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)
    
# contains extra name fields
class UserRegistration(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Regexp(PASSWORD_REGEX, error=PASSWORD_ERROR_SMG))

    first_name = fields.String(required=True, validate=validate.Length(min=1, max=30))
    last_name = fields.String(required=True, validate=validate.Length(min=1, max=30))

