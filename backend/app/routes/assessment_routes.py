from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.assessment_controller import (
    create_assessment,
    get_user_assessments,
    get_assessment_by_id,
    update_assessment,
    delete_assessment
)

assessment_bp = Blueprint('assessment', __name__, url_prefix='/api')
api = Api(assessment_bp)

class AssessmentListResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        return get_user_assessments(user_id)

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        return create_assessment(user_id, data)

class AssessmentDetailResource(Resource):
    @jwt_required()
    def get(self, assessment_id):
        user_id = get_jwt_identity()
        return get_assessment_by_id(user_id, assessment_id)

    @jwt_required()
    def put(self, assessment_id):
        user_id = get_jwt_identity()
        data = request.get_json()
        return update_assessment(user_id, assessment_id, data)

    @jwt_required()
    def delete(self, assessment_id):
        user_id = get_jwt_identity()
        return delete_assessment(user_id, assessment_id)

# Register resources
api.add_resource(AssessmentListResource, '/assessments')
api.add_resource(AssessmentDetailResource, '/assessments/<string:assessment_id>')
