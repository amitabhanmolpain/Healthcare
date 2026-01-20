from mongoengine import Document, StringField, DateField, DictField, ListField, EmbeddedDocument, EmbeddedDocumentField, BooleanField

class EmergencyContact(EmbeddedDocument):
    name = StringField()
    phone = StringField()

class PersonalInfo(EmbeddedDocument):
    full_name = StringField()
    email = StringField()
    phone = StringField()
    gender = StringField()
    dob = DateField()
    address = StringField()
    emergency_contact = EmbeddedDocumentField(EmergencyContact)

class MedicalHistory(EmbeddedDocument):
    blood_type = StringField()
    height = StringField()
    weight = StringField()
    last_checkup = DateField()
    allergies = ListField(StringField())
    chronic_conditions = ListField(StringField())
    medications = ListField(StringField())

class SecuritySettings(EmbeddedDocument):
    password_hash = StringField()
    two_factor_enabled = BooleanField(default=False)

class UserProfile(Document):
    user_id = StringField(required=True, unique=True)
    personal_info = EmbeddedDocumentField(PersonalInfo)
    medical_history = EmbeddedDocumentField(MedicalHistory)
    security_settings = EmbeddedDocumentField(SecuritySettings)

    meta = {'collection': 'user_profiles'}

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'personal_info': self.personal_info.to_mongo() if self.personal_info else {},
            'medical_history': self.medical_history.to_mongo() if self.medical_history else {},
            'security_settings': self.security_settings.to_mongo() if self.security_settings else {}
        }
