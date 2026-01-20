from mongoengine import Document, StringField, BooleanField, DateTimeField
from datetime import datetime


class Address(Document):
    """Address model for storing user's saved addresses"""
    user_id = StringField(required=True)
    full_name = StringField(required=True)
    phone = StringField(required=True)
    address_line1 = StringField(required=True)
    address_line2 = StringField()
    city = StringField(required=True)
    state = StringField(required=True)
    pincode = StringField(required=True)
    address_type = StringField(default="home")  # home, work, other
    is_default = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'addresses',
        'indexes': ['user_id', 'is_default']
    }
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': self.user_id,
            'full_name': self.full_name,
            'phone': self.phone,
            'address_line1': self.address_line1,
            'address_line2': self.address_line2,
            'city': self.city,
            'state': self.state,
            'pincode': self.pincode,
            'address_type': self.address_type,
            'is_default': self.is_default,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
