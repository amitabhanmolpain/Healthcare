from mongoengine import Document, StringField, DateTimeField, ReferenceField, BooleanField
from datetime import datetime
from app.models.user_models import User
from app.models.doctor_model import Doctor

class Appointment(Document):
    user = ReferenceField(User, required=True)
    doctor = ReferenceField(Doctor, required=True)
    appointment_date = DateTimeField(required=True)
    appointment_time = StringField(required=True)  # e.g., "10:00 AM"
    reason = StringField(required=True)
    status = StringField(default="pending", choices=["pending", "confirmed", "cancelled", "completed"])
    notes = StringField(default="")
    consultation_type = StringField(default="in-person", choices=["in-person", "video-call", "phone-call"])
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'appointments',
        'indexes': [
            'user',
            'doctor',
            'appointment_date',
            'status'
        ]
    }
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super(Appointment, self).save(*args, **kwargs)