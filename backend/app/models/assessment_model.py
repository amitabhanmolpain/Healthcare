from mongoengine import Document, StringField, ListField, DictField, IntField, DateTimeField
from datetime import datetime

class Assessment(Document):
    user_id = StringField(required=True)
    questions = ListField(DictField())  # Each question: {text, options, correct_answer}
    responses = ListField(DictField())  # Each response: {question_id, answer, is_correct}
    score = IntField(default=0)
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'assessments'}

    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': self.user_id,
            'questions': self.questions,
            'responses': self.responses,
            'score': self.score,
            'created_at': self.created_at.isoformat()
        }
