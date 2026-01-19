from flask import Blueprint, request, jsonify
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt, verify_jwt_in_request
from app.controllers.admin_controller import (
    admin_login,
    get_dashboard_stats,
    get_all_users_admin,
    get_all_appointments_admin,
    get_all_doctors_admin,
    update_appointment_status_admin,
    update_doctor_availability_admin
)
import traceback

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')
api = Api(admin_bp)

def admin_required():
    """Decorator to check if user is admin"""
    try:
        verify_jwt_in_request()
        claims = get_jwt()
        if not claims.get('is_admin'):
            return {"message": "Admin access required"}, 403
        return None
    except Exception as e:
        print(f"Admin auth error: {str(e)}")
        return {"message": f"Authentication error: {str(e)}"}, 401

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
        try:
            print("AdminDashboard GET request received")
            error = admin_required()
            if error:
                print(f"Admin auth failed: {error}")
                return error
            print("Admin auth successful, fetching stats")
            result = get_dashboard_stats()
            print("Stats fetched successfully")
            return result
        except Exception as e:
            print(f"AdminDashboard ERROR: {str(e)}")
            traceback.print_exc()
            return {"message": f"Internal server error: {str(e)}"}, 500
    
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

class AdminDoctors(Resource):
    """Get all doctors and update doctor availability"""
    
    @jwt_required()
    def get(self):
        error = admin_required()
        if error:
            return error
        return get_all_doctors_admin()
    
    def options(self):
        return {}, 200

class AdminDoctorDetail(Resource):
    """Update specific doctor"""
    
    @jwt_required()
    def put(self, doctor_id):
        error = admin_required()
        if error:
            return error
        data = request.get_json()
        is_active = data.get('is_active')
        if is_active is None:
            return {"message": "is_active is required"}, 400
        return update_doctor_availability_admin(doctor_id, is_active)
    
    def options(self, doctor_id):
        return {}, 200

class AdminAppointmentDetail(Resource):
    """Update specific appointment"""
    
    @jwt_required()
    def put(self, appointment_id):
        error = admin_required()
        if error:
            return error
        data = request.get_json()
        new_status = data.get('status')
        if not new_status:
            return {"message": "Status is required"}, 400
        return update_appointment_status_admin(appointment_id, new_status)
    
    def options(self, appointment_id):
        return {}, 200

# Register resources
api.add_resource(AdminLogin, '/login')
api.add_resource(AdminDashboard, '/dashboard')
api.add_resource(AdminUsers, '/users')
api.add_resource(AdminAppointments, '/appointments')
api.add_resource(AdminDoctors, '/doctors')
api.add_resource(AdminDoctorDetail, '/doctors/<string:doctor_id>')
api.add_resource(AdminAppointmentDetail, '/appointments/<string:appointment_id>')
