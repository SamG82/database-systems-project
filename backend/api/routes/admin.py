from flask import Blueprint, g
from api.services.auth import handle_register, handle_login, Role
from api.schemas.user import UserRegistration, UserLogin
from api.schemas import validate_with

admin_blueprint = Blueprint('admin', __name__, url_prefix='/admin')

# sql queries
create_admin_sql = 'INSERT INTO Admin(first_name, last_name, email, password_hash) VALUES(?,?,?,?)'    
find_admin_pw_by_email = 'SELECT id, password_hash FROM Admin WHERE email=?'

# creates an admin account with a hashed password
@admin_blueprint.route('/create', methods=['POST'])
@validate_with(UserRegistration)
def create_admin(data):
    return handle_register(g.db, g.db.cursor(), data, create_admin_sql)

# logs in an admin and applies cookie token
@admin_blueprint.route('/login', methods=['POST'])
@validate_with(UserLogin)
def login_admin(login_data):
    return handle_login(g.db.cursor(), login_data, find_admin_pw_by_email, Role.ADMIN)


