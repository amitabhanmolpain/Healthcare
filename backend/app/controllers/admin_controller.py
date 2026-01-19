from app.models.admin_model import Admin
from app.models.user_models import User
from app.models.doctor_model import Doctor
from app.models.appointments_models import Appointment
from flask import jsonify
from app import bcrypt, socketio
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
        print("=== Starting get_dashboard_stats ===")
        
        total_users = User.objects.count()
        print(f"Total users: {total_users}")
        
        total_doctors = Doctor.objects.count()
        print(f"Total doctors: {total_doctors}")
        
        total_appointments = Appointment.objects.count()
        print(f"Total appointments: {total_appointments}")
        
        # Appointments by status - handle case-insensitive matching
        pending_appointments = Appointment.objects(status__iexact="pending").count()
        print(f"Pending appointments: {pending_appointments}")
        
        confirmed_appointments = Appointment.objects(status__iexact="confirmed").count()
        print(f"Confirmed appointments: {confirmed_appointments}")
        
        completed_appointments = Appointment.objects(status__iexact="completed").count()
        print(f"Completed appointments: {completed_appointments}")
        
        cancelled_appointments = Appointment.objects(status__iexact="cancelled").count()
        print(f"Cancelled appointments: {cancelled_appointments}")
        
        # Recent appointments - order by appointment_date instead of created_at
        print("Fetching recent appointments...")
        recent_appointments = Appointment.objects().order_by('-appointment_date').limit(10)
        print(f"Found {recent_appointments.count()} recent appointments")
        
        # Serialize appointments with error handling
        serialized_appointments = []
        for apt in recent_appointments:
            try:
                serialized_appointments.append(_serialize_appointment(apt))
            except Exception as e:
                print(f"Error serializing appointment {apt.id}: {str(e)}")
                import traceback
                traceback.print_exc()
                continue
        
        print(f"Successfully serialized {len(serialized_appointments)} appointments")
        
        result = {
            "stats": {
                "total_users": total_users,
                "total_doctors": total_doctors,
                "total_appointments": total_appointments,
                "pending_appointments": pending_appointments,
                "confirmed_appointments": confirmed_appointments,
                "completed_appointments": completed_appointments,
                "cancelled_appointments": cancelled_appointments
            },
            "recent_appointments": serialized_appointments
        }
        
        print("=== get_dashboard_stats completed successfully ===")
        return result, 200
        
    except Exception as e:
        print(f"CRITICAL ERROR in get_dashboard_stats: {str(e)}")
        import traceback
        traceback.print_exc()
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

def get_all_doctors_admin():
    """Get all doctors with full details (admin only)"""
    try:
        doctors = Doctor.objects()
        doctors_list = []
        
        for doctor in doctors:
            doctors_list.append({
                "id": doctor.doctor_id,
                "name": doctor.name,
                "specialty": doctor.specialty,
                "image": doctor.img if hasattr(doctor, 'img') else None,
                "experience": doctor.experience,
                "rating": doctor.rating,
                "consultation_fee": doctor.consultation_fee,
                "availability": doctor.availability if hasattr(doctor, 'availability') else [],
                "qualifications": doctor.qualifications if hasattr(doctor, 'qualifications') else [],
                "about": doctor.about if hasattr(doctor, 'about') else "",
                "is_active": doctor.is_active if hasattr(doctor, 'is_active') else True
            })
        
        return {
            "doctors": doctors_list,
            "count": len(doctors_list)
        }, 200
    except Exception as e:
        return {"message": f"Error fetching doctors: {str(e)}"}, 500

def update_appointment_status_admin(appointment_id, new_status):
    """Update appointment status (admin only)"""
    try:
        # Validate status
        valid_statuses = ["pending", "confirmed", "cancelled", "completed"]
        if new_status not in valid_statuses:
            return {"message": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}, 400
        
        # Find appointment
        appointment = Appointment.objects(id=appointment_id).first()
        if not appointment:
            return {"message": "Appointment not found"}, 404
        
        # Update status
        appointment.status = new_status
        appointment.save()
        
        # Emit WebSocket event for real-time update
        socketio.emit('appointment_updated', {
            'appointment_id': str(appointment.id),
            'status': new_status,
            'appointment': _serialize_appointment(appointment)
        }, namespace='/')
        
        return {
            "message": f"Appointment status updated to {new_status}",
            "appointment": _serialize_appointment(appointment)
        }, 200
    except Exception as e:
        return {"message": f"Error updating appointment: {str(e)}"}, 500

def update_doctor_availability_admin(doctor_id, is_active):
    """Update doctor availability status (admin only)"""
    try:
        # Find doctor
        doctor = Doctor.objects(doctor_id=doctor_id).first()
        if not doctor:
            return {"message": "Doctor not found"}, 404
        
        # Update is_active field
        doctor.is_active = is_active
        doctor.save()
        
        # Emit WebSocket event for real-time update
        socketio.emit('doctor_status_updated', {
            'doctor_id': doctor.doctor_id,
            'is_active': is_active,
            'name': doctor.name
        }, namespace='/')
        
        return {
            "message": f"Doctor availability updated to {'active' if is_active else 'offline'}",
            "doctor": {
                "id": doctor.doctor_id,
                "name": doctor.name,
                "is_active": is_active
            }
        }, 200
    except Exception as e:
        return {"message": f"Error updating doctor availability: {str(e)}"}, 500

def _serialize_user(user):
    """Serialize user data"""
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "phone": user.phone if hasattr(user, 'phone') else None,
        "total_orders": 0,  # Placeholder for order count
        "created_at": user.created_at.strftime("%Y-%m-%d") if hasattr(user, 'created_at') and user.created_at else None
    }

def _serialize_appointment(appointment):
    """Serialize appointment data with doctor image"""
    try:
        # Try to get user data with null check
        user_data = {
            "id": str(appointment.user.id) if appointment.user else None,
            "name": appointment.user.name if appointment.user else "Unknown User",
            "email": appointment.user.email if appointment.user else "N/A"
        }
    except Exception as e:
        print(f"Error getting user data: {str(e)}")
        user_data = {
            "id": None,
            "name": "Unknown User",
            "email": "N/A"
        }
    
    # Try to get doctor data with proper null checking
    doctor_data = {
        "id": None,
        "name": "Unknown Doctor",
        "specialty": "N/A",
        "image": None,
        "rating": 0,
        "experience": 0,
        "consultation_fee": 0
    }
    
    try:
        # Check if doctor reference exists and is valid
        if appointment.doctor:
            # Fetch doctor from database to ensure it exists
            doctor = Doctor.objects(doctor_id=appointment.doctor.doctor_id).first()
            if doctor:
                doctor_data = {
                    "id": doctor.doctor_id,
                    "name": doctor.name,
                    "specialty": doctor.specialty,
                    "image": doctor.img if hasattr(doctor, 'img') else None,
                    "rating": doctor.rating if hasattr(doctor, 'rating') else 4.5,
                    "experience": doctor.experience if hasattr(doctor, 'experience') else 5,
                    "consultation_fee": doctor.consultation_fee if hasattr(doctor, 'consultation_fee') else 500
                }
            else:
                print(f"Doctor {appointment.doctor.doctor_id} not found in database")
    except Exception as e:
        print(f"Error getting doctor data: {str(e)}")
    
    return {
        "id": str(appointment.id),
        "user": user_data,
        "doctor": doctor_data,
        "appointment_date": appointment.appointment_date.strftime("%Y-%m-%d"),
        "appointment_time": appointment.appointment_time,
        "status": appointment.status,
        "consultation_type": appointment.consultation_type,
        "reason": appointment.reason
    }
