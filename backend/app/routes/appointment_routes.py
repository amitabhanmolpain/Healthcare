from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.appointment_controller import (
    create_appointment,
    get_user_appointments,
    get_appointment_by_id,
    update_appointment_status,
    cancel_appointment,
    get_available_slots,
    get_upcoming_appointments
)

appointment_bp = Blueprint("appointments", __name__)
api = Api(appointment_bp)

class AppointmentCreate(Resource):
    @jwt_required()
    def post(self):
        """Create a new appointment"""
        user_id = get_jwt_identity()
        data = request.get_json()
        return create_appointment(data, user_id)

class AppointmentList(Resource):
    @jwt_required()
    def get(self):
        """Get all appointments for the logged-in user"""
        user_id = get_jwt_identity()
        status = request.args.get('status')  # Optional filter by status
        return get_user_appointments(user_id, status)

class AppointmentDetail(Resource):
    @jwt_required()
    def get(self, appointment_id):
        """Get a specific appointment"""
        user_id = get_jwt_identity()
        return get_appointment_by_id(appointment_id, user_id)
    
    @jwt_required()
    def patch(self, appointment_id):
        """Update appointment status"""
        user_id = get_jwt_identity()
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return {"message": "Status is required"}, 400
        
        return update_appointment_status(appointment_id, user_id, new_status)
    
    @jwt_required()
    def delete(self, appointment_id):
        """Cancel an appointment"""
        user_id = get_jwt_identity()
        return cancel_appointment(appointment_id, user_id)

class AvailableSlots(Resource):
    @jwt_required()
    def get(self, doctor_id):
        """Get available time slots for a doctor on a specific date"""
        date = request.args.get('date')
        
        if not date:
            return {"message": "Date parameter is required"}, 400
        
        return get_available_slots(doctor_id, date)

class UpcomingAppointments(Resource):
    @jwt_required()
    def get(self):
        """Get upcoming appointments"""
        user_id = get_jwt_identity()
        days = request.args.get('days', default=30, type=int)
        return get_upcoming_appointments(user_id, days)

# Register routes
api.add_resource(AppointmentCreate, "/appointments")
api.add_resource(AppointmentList, "/appointments/my")
api.add_resource(AppointmentDetail, "/appointments/<string:appointment_id>")
api.add_resource(AvailableSlots, "/appointments/available-slots/<string:doctor_id>")
api.add_resource(UpcomingAppointments, "/appointments/upcoming")
