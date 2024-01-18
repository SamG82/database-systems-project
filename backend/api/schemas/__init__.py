from marshmallow import Schema, ValidationError

from functools import wraps
from flask import request 

# wraps request handlers with schema validation error handling
# passes the loaded data dictionary to the decorated function
def validate_with(schema: Schema):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            result = None 
            try:
                result = schema().load(request.json)

            # automatically cancel the request if the request body's json is invalid
            except ValidationError as e:
                return {'errors': e.messages_dict}, 400

            return f(result, *args, **kwargs)        
        return wrapper
    
    return decorator