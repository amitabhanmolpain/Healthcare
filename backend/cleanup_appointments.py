"""
Cleanup script to remove appointments with invalid doctor references
"""
from mongoengine import connect
from app.models.appointments_models import Appointment
from app.models.doctor_model import Doctor
from app.config import Config

# Connect to MongoDB
connect(host=Config.MONGO_URI)

def cleanup_invalid_appointments():
    """Remove or fix appointments with invalid doctor references"""
    print("Starting cleanup of invalid appointments...")
    
    # Get all appointments
    all_appointments = Appointment.objects()
    print(f"Total appointments: {all_appointments.count()}")
    
    invalid_count = 0
    fixed_count = 0
    
    for appointment in all_appointments:
        try:
            # Try to access doctor
            if appointment.doctor:
                doctor_id = appointment.doctor.doctor_id
                # Check if doctor exists in database
                doctor = Doctor.objects(doctor_id=doctor_id).first()
                if not doctor:
                    print(f"⚠️  Appointment {appointment.id} references non-existent doctor {doctor_id}")
                    # Delete the invalid appointment
                    appointment.delete()
                    invalid_count += 1
                    print(f"   Deleted appointment {appointment.id}")
        except Exception as e:
            print(f"❌ Error processing appointment {appointment.id}: {str(e)}")
            # Delete problematic appointment
            try:
                appointment.delete()
                invalid_count += 1
                print(f"   Deleted problematic appointment {appointment.id}")
            except:
                pass
    
    print(f"\n✅ Cleanup completed!")
    print(f"   Invalid appointments deleted: {invalid_count}")
    print(f"   Valid appointments remaining: {Appointment.objects().count()}")

if __name__ == "__main__":
    cleanup_invalid_appointments()
