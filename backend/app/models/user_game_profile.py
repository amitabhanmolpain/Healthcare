from mongoengine import Document, ReferenceField, IntField, StringField, ListField, DateTimeField
from datetime import datetime
from app.models.user_models import User

class UserGameProfile(Document):
    user = ReferenceField(User, required=True, unique=True)
    xp = IntField(default=0)
    level = IntField(default=1)
    total_score = IntField(default=0)
    badges = ListField(StringField(), default=list)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'user_game_profiles',
        'indexes': ['user'],
        'ordering': ['-xp', '-level']
    }

class GameScore(Document):
    user = ReferenceField(User, required=True)
    game_name = StringField(required=True)
    score = IntField(required=True)
    xp_earned = IntField(default=0)
    timestamp = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'game_scores',
        'indexes': ['user', 'game_name'],
        'ordering': ['-timestamp']
    }