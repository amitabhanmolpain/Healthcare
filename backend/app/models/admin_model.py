from mongoengine import Document, StringField, EmailField, DateTimeField, BooleanField
from datetime import datetime

class Admin(Document):
    """Admin model for system administrators"""
    
    name = StringField(required=True, max_length=100)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    role = StringField(default="admin", choices=["admin", "super_admin"])
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
    last_login = DateTimeField()
    
    meta = {
        'collection': 'admins',
        'indexes': ['email']
    }
    
    def to_dict(self):
        """Convert admin document to dictionary"""
        return {
            'id': str(self.id),
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
            'last_login': self.last_login.strftime("%Y-%m-%d %H:%M:%S") if self.last_login else None
        }
