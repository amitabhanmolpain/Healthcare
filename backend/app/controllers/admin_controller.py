from app.models.admin_model import Admin
from app.models.user_models import User
from app.models.doctor_model import Doctor
from app.models.appointments_models import Appointment
from flask import jsonify
from app import bcrypt
from flask_jwt_extended import create_access_token
from datetime import datetime

def admin_login(data):
    """Admin login endpoint"""
    try:
        # Validate input
        if not data.get("email") or not data.get("password"):
            return {"message": "Email and password are required"}, 400
        
        # Find admin by email
        admin = Admin.objects(email=data["email"]).first()
        
        if not admin:
            return {"message": "Invalid admin credentials"}, 401
        
        # Check if admin is active
        if not admin.is_active:
            return {"message": "Admin account is deactivated"}, 403
        
        # Verify password
        if not bcrypt.check_password_hash(admin.password, data["password"]):
            return {"message": "Invalid admin credentials"}, 401
        
        # Update last login
        admin.last_login = datetime.utcnow()
        admin.save()
        
        # Create JWT token with admin role
        token = create_access_token(
            identity=str(admin.id),
            additional_claims={
                "email": admin.email,
                "name": admin.name,
                "role": admin.role,
                "is_admin": True
            }
        )
        
        return {
            "message": "Admin login successful",
            "token": token,
            "admin": admin.to_dict()
        }, 200
        
    except Exception as e:
        return {"message": f"Login error: {str(e)}"}, 500

def get_dashboard_stats():
    """Get admin dashboard statistics"""
    try:
        total_users = User.objects.count()
        total_doctors = Doctor.objects.count()
        total_appointments = Appointment.objects.count()
        
        # Appointments by status
        pending_appointments = Appointment.objects(status="pending").count()
        confirmed_appointments = Appointment.objects(status="confirmed").count()
        completed_appointments = Appointment.objects(status="completed").count()
        cancelled_appointments = Appointment.objects(status="cancelled").count()
        
        # Recent appointments
        recent_appointments = Appointment.objects().order_by('-created_at').limit(10)
        
        return {
            "stats": {
                "total_users": total_users,
                "total_doctors": total_doctors,
                "total_appointments": total_appointments,
                "pending_appointments": pending_appointments,
                "confirmed_appointments": confirmed_appointments,
                "completed_appointments": completed_appointments,
                "cancelled_appointments": cancelled_appointments
            },
            "recent_appointments": [_serialize_appointment(apt) for apt in recent_appointments]
        }, 200
        
    except Exception as e:
        return {"message": f"Error fetching stats: {str(e)}"}, 500

def get_all_users_admin():
    """Get all users (admin only)"""
    try:
        users = User.objects()
        return {
            "users": [_serialize_user(user) for user in users],
            "count": len(users)
        }, 200
    except Exception as e:
        return {"message": f"Error fetching users: {str(e)}"}, 500

def get_all_appointments_admin():
    """Get all appointments (admin only)"""
    try:
        appointments = Appointment.objects().order_by('-appointment_date')
        return {
            "appointments": [_serialize_appointment(apt) for apt in appointments],
            "count": len(appointments)
        }, 200
    except Exception as e:
        return {"message": f"Error fetching appointments: {str(e)}"}, 500

def _serialize_user(user):
    """Serialize user data"""
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "phone": user.phone if hasattr(user, 'phone') else None,
        "created_at": user.created_at.strftime("%Y-%m-%d") if hasattr(user, 'created_at') and user.created_at else None
    }

def _serialize_appointment(appointment):
    """Serialize appointment data"""
    return {
        "id": str(appointment.id),
        "user": {
            "id": str(appointment.user.id),
            "name": appointment.user.name,
            "email": appointment.user.email
        },
        "doctor": {
            "id": appointment.doctor.doctor_id,
            "name": appointment.doctor.name,
            "specialty": appointment.doctor.specialty
        },
        "appointment_date": appointment.appointment_date.strftime("%Y-%m-%d"),
        "appointment_time": appointment.appointment_time,
        "status": appointment.status,
        "consultation_type": appointment.consultation_type,
        "reason": appointment.reason
    }
