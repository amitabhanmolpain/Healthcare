from mongoengine import Document, StringField, IntField, FloatField, ListField, DictField, BooleanField
from datetime import datetime

class Doctor(Document):
    doctor_id = StringField(required=True, unique=True)
    name = StringField(required=True)
    specialty = StringField(required=True)
    img = StringField()
    experience = IntField(default=5)  # years of experience
    rating = FloatField(default=4.5)
    consultation_fee = IntField(default=500)  # in currency units
    availability = ListField(StringField(), default=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
    qualifications = ListField(StringField(), default=[])
    about = StringField(default="")
    is_active = BooleanField(default=True)  # Doctor availability status
    
    meta = {
        'collection': 'doctors'
    }
