from app.models.profile_model import UserProfile, PersonalInfo, MedicalHistory, SecuritySettings, EmergencyContact
from mongoengine.errors import DoesNotExist
from werkzeug.security import generate_password_hash, check_password_hash

# Get profile section

def get_profile_section(user_id, section):
    try:
        profile = UserProfile.objects.get(user_id=user_id)
        return {section: getattr(profile, section).to_mongo() if getattr(profile, section) else {}}, 200
    except DoesNotExist:
        # Auto-create blank profile if not found
        profile = UserProfile(user_id=user_id)
        profile.save()
        return {section: {}}, 200

# Update profile section

def update_profile_section(user_id, section, data):
    profile, created = UserProfile.objects.get_or_create(user_id=user_id)
    if section == 'personal_info':
        ec = data.get('emergency_contact', {})
        emergency_contact = EmergencyContact(name=ec.get('name', ''), phone=ec.get('phone', ''))
        profile.personal_info = PersonalInfo(
            full_name=data.get('full_name', ''),
            email=data.get('email', ''),
            phone=data.get('phone', ''),
            gender=data.get('gender', ''),
            dob=data.get('dob', None),
            address=data.get('address', ''),
            emergency_contact=emergency_contact
        )
    elif section == 'medical_history':
        profile.medical_history = MedicalHistory(
            blood_type=data.get('blood_type', ''),
            height=data.get('height', ''),
            weight=data.get('weight', ''),
            last_checkup=data.get('last_checkup', None),
            allergies=data.get('allergies', []),
            chronic_conditions=data.get('chronic_conditions', []),
            medications=data.get('medications', [])
        )
    elif section == 'security_settings':
        password = data.get('password', None)
        two_factor = data.get('two_factor_enabled', False)
        password_hash = generate_password_hash(password) if password else profile.security_settings.password_hash if profile.security_settings else ''
        profile.security_settings = SecuritySettings(
            password_hash=password_hash,
            two_factor_enabled=two_factor
        )
    profile.save()
    return {'message': f'{section} updated', section: getattr(profile, section).to_mongo()}, 200
