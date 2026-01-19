"""
Create test appointments with valid doctor and user references
"""
from mongoengine import connect
from app.models.appointments_models import Appointment
from app.models.doctor_model import Doctor
from app.models.user_models import User
from app.config import Config
from datetime import datetime, timedelta

# Connect to MongoDB
connect(host=Config.MONGO_URI)

def create_test_appointments():
    """Create test appointments with valid references"""
    print("Creating test appointments...")
    
    # Get first available doctor
    doctors = Doctor.objects().limit(3)
    print(f"Found {doctors.count()} doctors")
    
    # Get first available user
    users = User.objects().limit(2)
    print(f"Found {users.count()} users")
    
    if doctors.count() == 0:
        print("❌ No doctors found! Please run seed.py first.")
        return
    
    if users.count() == 0:
        print("❌ No users found! Creating a test user...")
        test_user = User(
            name="Test Patient",
            email="patient@test.com",
            password="hashed_password",
            phone="1234567890"
        )
        test_user.save()
        users = [test_user]
    
    # Create 5 test appointments
    statuses = ["pending", "confirmed", "pending", "confirmed", "completed"]
    consultation_types = ["video-call", "in-person", "phone-call", "video-call", "in-person"]
    
    for i, status in enumerate(statuses):
        doctor = doctors[i % doctors.count()]
        user = users[i % users.count()]
        
        appointment = Appointment(
            user=user,
            doctor=doctor,
            appointment_date=datetime.now() + timedelta(days=i+1),
            appointment_time=f"{10+i}:00 AM",
            status=status,
            consultation_type=consultation_types[i],
            reason=f"Test consultation {i+1}"
        )
        appointment.save()
        print(f"✅ Created appointment {i+1}: {user.name} with Dr. {doctor.name} - {status}")
    
    print(f"\n✅ Successfully created {len(statuses)} test appointments!")
    print(f"Total appointments in database: {Appointment.objects().count()}")

if __name__ == "__main__":
    create_test_appointments()
