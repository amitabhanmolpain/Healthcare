from app import create_app
from app.models.admin_model import Admin
from flask_bcrypt import Bcrypt
from mongoengine import connect
import os
from dotenv import load_dotenv

load_dotenv()

# Create Flask app context
app = create_app()
bcrypt = Bcrypt(app)

def create_admin_user():
    """Create default admin user"""
    with app.app_context():
        # Check if admin already exists
        existing_admin = Admin.objects(email="admin@healthcare.com").first()
        
        if existing_admin:
            print("Admin user already exists!")
            print(f"Email: {existing_admin.email}")
            return
        
        # Create new admin
        admin = Admin(
            name="Admin User",
            email="admin@healthcare.com",
            password=bcrypt.generate_password_hash("admin123").decode('utf-8'),
            role="super_admin",
            is_active=True
        )
        admin.save()
        
        print("✅ Admin user created successfully!")
        print(f"Email: admin@healthcare.com")
        print(f"Password: admin123")
        print(f"Role: super_admin")
        print("\n⚠️  Please change the password after first login!")

if __name__ == "__main__":
    create_admin_user()
