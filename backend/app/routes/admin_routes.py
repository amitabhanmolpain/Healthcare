from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.controllers.admin_controller import (
    admin_login,
    get_dashboard_stats,
    get_all_users_admin,
    get_all_appointments_admin
)

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')
api = Api(admin_bp)

def admin_required():
    """Decorator to check if user is admin"""
    claims = get_jwt()
    if not claims.get('is_admin'):
        return {"message": "Admin access required"}, 403
    return None

class AdminLogin(Resource):
    """Admin login endpoint"""
    
    def post(self):
        data = request.get_json()
        return admin_login(data)
    
    def options(self):
        """Handle preflight request"""
        return {}, 200

class AdminDashboard(Resource):
    """Admin dashboard statistics"""
    
    @jwt_required()
    def get(self):
        error = admin_required()
        if error:
            return error
        return get_dashboard_stats()
    
    def options(self):
        return {}, 200

class AdminUsers(Resource):
    """Get all users"""
    
    @jwt_required()
    def get(self):
        error = admin_required()
        if error:
            return error
        return get_all_users_admin()
    
    def options(self):
        return {}, 200

class AdminAppointments(Resource):
    """Get all appointments"""
    
    @jwt_required()
    def get(self):
        error = admin_required()
        if error:
            return error
        return get_all_appointments_admin()
    
    def options(self):
        return {}, 200

# Register resources
api.add_resource(AdminLogin, '/login')
api.add_resource(AdminDashboard, '/dashboard')
api.add_resource(AdminUsers, '/users')
api.add_resource(AdminAppointments, '/appointments')
