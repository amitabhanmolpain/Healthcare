from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.profile_controller import get_profile_section, update_profile_section

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')
api = Api(profile_bp)

class PersonalInfoResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        return get_profile_section(user_id, 'personal_info')

    @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        return update_profile_section(user_id, 'personal_info', data)

class MedicalHistoryResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        return get_profile_section(user_id, 'medical_history')

    @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        return update_profile_section(user_id, 'medical_history', data)

class SecuritySettingsResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        return get_profile_section(user_id, 'security_settings')

    @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        return update_profile_section(user_id, 'security_settings', data)

# Register resources
api.add_resource(PersonalInfoResource, '/personal')
api.add_resource(MedicalHistoryResource, '/medical')
api.add_resource(SecuritySettingsResource, '/security')
