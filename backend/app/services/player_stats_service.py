from datetime import datetime
from mongoengine.errors import DoesNotExist
from app.models.player_stats_model import PlayerStats

# --- Helper Functions ---
def get_or_create_stats(user_id):
    try:
        stats = PlayerStats.objects.get(user_id=user_id)
    except DoesNotExist:
        stats = PlayerStats(user_id=user_id)
        stats.save()
    return stats

def recalculate_win_rate(stats):
    v = stats.global_stats.get('victories', 0)
    l = stats.global_stats.get('losses', 0)
    total = v + l
    stats.global_stats['win_rate'] = round((v / total) * 100, 2) if total > 0 else 0.0
    return stats

def update_game_result(user_id, game, is_win, xp_earned):
    stats = get_or_create_stats(user_id)
    # Global stats
    if is_win:
        stats.global_stats['victories'] = stats.global_stats.get('victories', 0) + 1
        stats.global_stats['current_streak'] = stats.global_stats.get('current_streak', 0) + 1
    else:
        stats.global_stats['losses'] = stats.global_stats.get('losses', 0) + 1
        stats.global_stats['current_streak'] = 0
    stats.global_stats['xp'] = stats.global_stats.get('xp', 0) + xp_earned
    # Level up logic (simple: 100xp per level)
    while stats.global_stats['xp'] >= stats.global_stats['level'] * 100:
        stats.global_stats['xp'] -= stats.global_stats['level'] * 100
        stats.global_stats['level'] += 1
    # Per-game stats
    if game not in stats.games:
        stats.games[game] = {
            'level': 1, 'xp': 0, 'victories': 0, 'losses': 0, 'current_streak': 0
        }
    g = stats.games[game]
    if is_win:
        g['victories'] = g.get('victories', 0) + 1
        g['current_streak'] = g.get('current_streak', 0) + 1
    else:
        g['losses'] = g.get('losses', 0) + 1
        g['current_streak'] = 0
    g['xp'] = g.get('xp', 0) + xp_earned
    while g['xp'] >= g['level'] * 100:
        g['xp'] -= g['level'] * 100
        g['level'] += 1
    stats.games[game] = g
    # Recalculate win rate
    recalculate_win_rate(stats)
    # Achievements
    check_and_unlock_achievements(stats)
    stats.updated_at = datetime.utcnow()
    stats.save()
    return stats

def add_achievement(stats, code, title):
    if not any(a['code'] == code for a in stats.achievements):
        stats.achievements.append({
            'code': code,
            'title': title,
            'earned_at': datetime.utcnow()
        })
        stats.save()

def add_badge(stats, code, level):
    if not any(b['code'] == code and b['level'] == level for b in stats.badges):
        stats.badges.append({
            'code': code,
            'level': level,
            'earned_at': datetime.utcnow()
        })
        stats.save()

def check_and_unlock_achievements(stats):
    # FIRST_WIN
    if stats.global_stats.get('victories', 0) >= 1:
        add_achievement(stats, 'FIRST_WIN', 'First Victory!')
    # STREAK_5
    if stats.global_stats.get('current_streak', 0) >= 5:
        add_achievement(stats, 'STREAK_5', '5-Win Streak!')
    # LEVEL_5
    if stats.global_stats.get('level', 1) >= 5:
        add_achievement(stats, 'LEVEL_5', 'Level 5 Reached!')
