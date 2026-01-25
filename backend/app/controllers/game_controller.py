from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user_models import User
from app.models.user_game_profile import UserGameProfile, GameScore
from mongoengine import Q

game_bp = Blueprint('game', __name__)

def get_or_create_profile(user):
    profile = UserGameProfile.objects(user=user).first()
    if not profile:
        profile = UserGameProfile(user=user)
        profile.save()
    return profile

def update_badges(profile):
    badges = set(profile.badges)
    if profile.xp >= 500:
        badges.add('Pro')
    if profile.level >= 5:
        badges.add('Level 5')
    if profile.xp > 0:
        badges.add('Starter')
    profile.badges = list(badges)
    profile.save()

@game_bp.route('/api/game/submit', methods=['POST'])
@jwt_required()
def submit_game():
    user_id = get_jwt_identity()
    user = User.objects(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    data = request.get_json()
    game_name = data.get('game_name')
    score = int(data.get('score', 0))
    xp_earned = int(data.get('xp_earned', 0))
    if not game_name:
        return jsonify({'error': 'Missing game_name'}), 400
    # Save game score with error handling
    try:
        GameScore(user=user, game_name=game_name, score=score, xp_earned=xp_earned).save()
    except Exception as e:
        print(f"[GameScore Save Error] {e}")
        return jsonify({'error': 'Failed to save game score', 'details': str(e)}), 500
    # Update profile
    try:
        profile = get_or_create_profile(user)
        profile.xp += xp_earned
        profile.total_score += score
        # Level logic: every 100 XP = 1 level
        while profile.xp >= profile.level * 100:
            profile.xp -= profile.level * 100
            profile.level += 1
        update_badges(profile)
        profile.updated_at = datetime.utcnow()
        profile.save()
    except Exception as e:
        print(f"[UserGameProfile Save Error] {e}")
        return jsonify({'error': 'Failed to update user profile', 'details': str(e)}), 500
    return jsonify({
        'xp': profile.xp,
        'level': profile.level,
        'total_score': profile.total_score,
        'badges': profile.badges
    }), 200

@game_bp.route('/api/game/leaderboard', methods=['GET'])
def leaderboard():
    top_profiles = UserGameProfile.objects.order_by('-level', '-xp', '-total_score').limit(10)
    result = []
    for p in top_profiles:
        result.append({
            'user_id': str(p.user.id),
            'name': p.user.name,
            'level': p.level,
            'xp': p.xp,
            'total_score': p.total_score,
            'badges': p.badges
        })
    return jsonify({'leaderboard': result}), 200

@game_bp.route('/api/game/me', methods=['GET'])
@jwt_required()
def my_progress():
    user_id = get_jwt_identity()
    user = User.objects(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    profile = get_or_create_profile(user)
    return jsonify({
        'xp': profile.xp,
        'level': profile.level,
        'total_score': profile.total_score,
        'badges': profile.badges
    }), 200