from app.models.assessment_model import Assessment
from mongoengine.errors import DoesNotExist

# Create a new assessment

def create_assessment(user_id, data):
    assessment = Assessment(
        user_id=user_id,
        questions=data.get('questions', []),
        responses=data.get('responses', []),
        score=data.get('score', 0)
    )
    assessment.save()
    return {'message': 'Assessment created', 'assessment': assessment.to_dict()}, 201

# Get all assessments for a user

def get_user_assessments(user_id):
    assessments = Assessment.objects(user_id=user_id)
    return {'assessments': [a.to_dict() for a in assessments]}, 200

# Get a specific assessment

def get_assessment_by_id(user_id, assessment_id):
    try:
        assessment = Assessment.objects.get(id=assessment_id, user_id=user_id)
        return {'assessment': assessment.to_dict()}, 200
    except DoesNotExist:
        return {'error': 'Assessment not found'}, 404

# Update an assessment

def update_assessment(user_id, assessment_id, data):
    try:
        assessment = Assessment.objects.get(id=assessment_id, user_id=user_id)
        assessment.questions = data.get('questions', assessment.questions)
        assessment.responses = data.get('responses', assessment.responses)
        assessment.score = data.get('score', assessment.score)
        assessment.save()
        return {'message': 'Assessment updated', 'assessment': assessment.to_dict()}, 200
    except DoesNotExist:
        return {'error': 'Assessment not found'}, 404

# Delete an assessment

def delete_assessment(user_id, assessment_id):
    try:
        assessment = Assessment.objects.get(id=assessment_id, user_id=user_id)
        assessment.delete()
        return {'message': 'Assessment deleted'}, 200
    except DoesNotExist:
        return {'error': 'Assessment not found'}, 404
