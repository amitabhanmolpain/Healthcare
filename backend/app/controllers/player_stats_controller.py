from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..services.player_stats_service import (
    get_or_create_stats, update_game_result
)

player_stats_bp = Blueprint('player_stats', __name__)

@player_stats_bp.route('/api/stats', methods=['GET'])
@jwt_required()
def get_stats():
    import bson
    from app.services.redis_service import redis_client
    import json
    user_id = get_jwt_identity()
    redis_key = f"player_stats:{user_id}"
    stats_json = redis_client.get(redis_key)
    if stats_json:
        # Return from Redis cache
        stats_dict = json.loads(stats_json)
        # Stringify _id and user_id if present
        if '_id' in stats_dict:
            stats_dict['_id'] = str(stats_dict['_id'])
        if 'user_id' in stats_dict:
            stats_dict['user_id'] = str(stats_dict['user_id'])
        return jsonify(stats_dict), 200
    # Fallback to MongoDB
    stats = get_or_create_stats(user_id)
    data = stats.to_mongo().to_dict()
    if '_id' in data:
        data['_id'] = str(data['_id'])
    if 'user_id' in data:
        data['user_id'] = str(data['user_id'])
    return jsonify(data), 200

@player_stats_bp.route('/api/stats/update', methods=['POST'])
@jwt_required()
def update_stats():
    import bson
    user_id = get_jwt_identity()
    data = request.get_json()
    game = data.get('game')
    win = data.get('win')
    xp = data.get('xp', 0)
    if not game or win is None:
        return jsonify({'error': 'Missing game or win'}), 400
    stats = update_game_result(user_id, game, win, xp)
    data = stats.to_mongo().to_dict()
    if '_id' in data:
        data['_id'] = str(data['_id'])
    if 'user_id' in data:
        data['user_id'] = str(data['user_id'])
    return jsonify(data), 200

@player_stats_bp.route('/api/stats/achievements', methods=['GET'])
@jwt_required()
def get_achievements():
    user_id = get_jwt_identity()
    stats = get_or_create_stats(user_id)
    return jsonify(stats.achievements), 200

@player_stats_bp.route('/api/stats/badges', methods=['GET'])
@jwt_required()
def get_badges():
    user_id = get_jwt_identity()
    stats = get_or_create_stats(user_id)
    return jsonify(stats.badges), 200
