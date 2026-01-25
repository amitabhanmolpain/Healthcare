from app.models.appointments_models import Appointment
from app.models.doctor_model import Doctor
from app.models.user_models import User
from datetime import datetime, timedelta
from flask import jsonify

def create_appointment(data, user_id):
    """Create a new appointment"""
    try:
        # Validate required fields
        required = ["doctor_id", "appointment_date", "appointment_time", "reason"]
        if not all(data.get(field) for field in required):
            return {"message": "Doctor, date, time, and reason are required"}, 400
        
        # Check if video call is being requested
        consultation_type = data.get("consultation_type", "in-person")
        if consultation_type == "video-call" or consultation_type == "video":
            return {
                "message": "Video consultation feature is currently under development. Please select in-person consultation for now.",
                "feature_unavailable": True
            }, 400
        
        # Get user
        user = User.objects(id=user_id).first()
        if not user:
            return {"message": "User not found"}, 404
        
        # Get doctor
        doctor = Doctor.objects(doctor_id=data["doctor_id"]).first()
        if not doctor:
            return {"message": "Doctor not found"}, 404
        
        # Parse appointment date
        try:
            appointment_date = datetime.strptime(data["appointment_date"], "%Y-%m-%d")
        except ValueError:
            return {"message": "Invalid date format. Use YYYY-MM-DD"}, 400
        
        # Check if date is in the past
        if appointment_date.date() < datetime.now().date():
            return {"message": "Cannot book appointments in the past"}, 400
        
        # Check if doctor is available on that day
        day_name = appointment_date.strftime("%A")
        if day_name not in doctor.availability:
            return {"message": f"Doctor is not available on {day_name}"}, 400
        
        # Check for conflicting appointments
        existing = Appointment.objects(
            doctor=doctor,
            appointment_date=appointment_date,
            appointment_time=data["appointment_time"],
            status__in=["pending", "confirmed"]
        ).first()
        
        if existing:
            return {"message": "This time slot is already booked"}, 409
        
        # Create appointment
        appointment = Appointment(
            user=user,
            doctor=doctor,
            appointment_date=appointment_date,
            appointment_time=data["appointment_time"],
            reason=data["reason"],
            notes=data.get("notes", ""),
            consultation_type=data.get("consultation_type", "in-person"),
            status="pending"
        )
        appointment.save()
        
        return {
            "message": "Appointment booked successfully",
            "appointment": _serialize_appointment(appointment)
        }, 201
        
    except Exception as e:
        return {"message": f"Error creating appointment: {str(e)}"}, 500

def get_user_appointments(user_id, status=None):
    """Get all appointments for a user"""
    try:
        print(f"Fetching appointments for user_id: {user_id}")
        user = User.objects(id=user_id).first()
        if not user:
            print(f"User not found with id: {user_id}")
            return {"message": "User not found"}, 404
        
        print(f"User found: {user.name}")
        
        # Filter by status if provided
        if status:
            appointments = Appointment.objects(user=user, status=status).order_by('-appointment_date')
        else:
            appointments = Appointment.objects(user=user).order_by('-appointment_date')
        
        print(f"Found {len(appointments)} appointments")
        
        serialized = []
        for apt in appointments:
            try:
                serialized.append(_serialize_appointment(apt))
            except Exception as e:
                print(f"Error serializing appointment {apt.id}: {str(e)}")
                raise
        
        return {
            "appointments": serialized,
            "count": len(serialized)
        }, 200
        
    except Exception as e:
        print(f"Error in get_user_appointments: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"message": f"Error fetching appointments: {str(e)}"}, 500

def get_appointment_by_id(appointment_id, user_id):
    """Get a specific appointment by ID"""
    try:
        appointment = Appointment.objects(id=appointment_id).first()
        
        if not appointment:
            return {"message": "Appointment not found"}, 404
        
        # Verify user owns this appointment
        if str(appointment.user.id) != user_id:
            return {"message": "Unauthorized"}, 403
        
        return _serialize_appointment(appointment), 200
        
    except Exception as e:
        return {"message": f"Error fetching appointment: {str(e)}"}, 500

def update_appointment_status(appointment_id, user_id, new_status):
    """Update appointment status (cancel, confirm, etc.)"""
    try:
        appointment = Appointment.objects(id=appointment_id).first()
        
        if not appointment:
            return {"message": "Appointment not found"}, 404
        
        # Verify user owns this appointment
        if str(appointment.user.id) != user_id:
            return {"message": "Unauthorized"}, 403
        
        # Validate status
        valid_statuses = ["pending", "confirmed", "cancelled", "completed"]
        if new_status not in valid_statuses:
            return {"message": "Invalid status"}, 400
        
        appointment.status = new_status
        appointment.save()
        
        return {
            "message": f"Appointment {new_status} successfully",
            "appointment": _serialize_appointment(appointment)
        }, 200
        
    except Exception as e:
        return {"message": f"Error updating appointment: {str(e)}"}, 500

def cancel_appointment(appointment_id, user_id):
    """Cancel an appointment"""
    return update_appointment_status(appointment_id, user_id, "cancelled")

def get_available_slots(doctor_id, date):
    """Get available time slots for a doctor on a specific date"""
    try:
        doctor = Doctor.objects(doctor_id=doctor_id).first()
        if not doctor:
            return {"message": "Doctor not found"}, 404
        
        # Parse date
        try:
            appointment_date = datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            return {"message": "Invalid date format. Use YYYY-MM-DD"}, 400
        
        # Check if doctor is available on that day
        day_name = appointment_date.strftime("%A")
        if day_name not in doctor.availability:
            return {
                "available": False,
                "message": f"Doctor is not available on {day_name}",
                "slots": []
            }, 200
        
        # Define time slots (9 AM to 5 PM)
        all_slots = [
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
            "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
            "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
            "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
        ]
        
        # Get booked slots
        booked_appointments = Appointment.objects(
            doctor=doctor,
            appointment_date=appointment_date,
            status__in=["pending", "confirmed"]
        )
        booked_slots = [apt.appointment_time for apt in booked_appointments]
        
        # Filter available slots
        available_slots = [slot for slot in all_slots if slot not in booked_slots]
        
        return {
            "available": True,
            "date": date,
            "doctor": doctor.name,
            "slots": available_slots,
            "total_slots": len(available_slots)
        }, 200
        
    except Exception as e:
        return {"message": f"Error fetching available slots: {str(e)}"}, 500

def get_upcoming_appointments(user_id, days=30):
    """Get upcoming appointments for a user"""
    try:
        user = User.objects(id=user_id).first()
        if not user:
            return {"message": "User not found"}, 404
        
        # Get appointments from today onwards
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        future_date = today + timedelta(days=days)
        
        appointments = Appointment.objects(
            user=user,
            appointment_date__gte=today,
            appointment_date__lte=future_date,
            status__in=["pending", "confirmed"]
        ).order_by('appointment_date')
        
        return {
            "appointments": [_serialize_appointment(apt) for apt in appointments],
            "count": len(appointments)
        }, 200
        
    except Exception as e:
        return {"message": f"Error fetching upcoming appointments: {str(e)}"}, 500

def _serialize_appointment(appointment):
    """Helper function to serialize appointment data"""
    try:
        doctor = appointment.doctor
        doctor_data = {
            "id": doctor.doctor_id,
            "name": doctor.name,
            "specialty": doctor.specialty,
            "image": doctor.img,
            "consultation_fee": doctor.consultation_fee
        } if doctor else None
    except Exception:
        doctor_data = {
            "id": None,
            "name": "Unknown Doctor",
            "specialty": "",
            "image": None,
            "consultation_fee": None
        }
    return {
        "id": str(appointment.id),
        "doctor": doctor_data,
        "appointment_date": appointment.appointment_date.strftime("%Y-%m-%d"),
        "appointment_time": appointment.appointment_time,
        "reason": appointment.reason,
        "notes": appointment.notes or "",
        "consultation_type": appointment.consultation_type,
        "status": appointment.status,
        "created_at": appointment.created_at.strftime("%Y-%m-%d %H:%M:%S") if appointment.created_at else None,
        "updated_at": appointment.updated_at.strftime("%Y-%m-%d %H:%M:%S") if appointment.updated_at else None
    }
