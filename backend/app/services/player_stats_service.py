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

def add_achievement(stats, code, title, game=None):
    if not any(a['code'] == code for a in stats.achievements):
        stats.achievements.append({
            'code': code,
            'title': title,
            'game': game,
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
    # Global achievements
    if stats.global_stats.get('victories', 0) >= 1:
        add_achievement(stats, 'FIRST_WIN', 'First Victory!', 'global')
    if stats.global_stats.get('current_streak', 0) >= 5:
        add_achievement(stats, 'STREAK_5', '5-Win Streak!', 'global')
    if stats.global_stats.get('level', 1) >= 5:
        add_achievement(stats, 'LEVEL_5', 'Level 5 Reached!', 'global')
    if stats.global_stats.get('victories', 0) >= 10:
        add_achievement(stats, 'WIN_MASTER', '10 Victories!', 'global')
    if stats.global_stats.get('level', 1) >= 10:
        add_achievement(stats, 'LEVEL_MASTER', 'Level 10 Reached!', 'global')

    # Game-specific achievements
    for game_name, game_stats in stats.games.items():
        game_display_name = {
            'thoughtbattle': 'Thought Battle',
            'lifequest': 'Life Quest',
            'emotionquest': 'Emotion Quest'
        }.get(game_name, game_name.title())

        # First win in specific game
        if game_stats.get('victories', 0) >= 1:
            add_achievement(stats, f'{game_name.upper()}_FIRST_WIN', f'First {game_display_name} Victory!', game_name)

        # Game-specific level achievements
        if game_stats.get('level', 1) >= 3:
            add_achievement(stats, f'{game_name.upper()}_LEVEL_3', f'{game_display_name} Level 3!', game_name)
        if game_stats.get('level', 1) >= 5:
            add_achievement(stats, f'{game_name.upper()}_LEVEL_5', f'{game_display_name} Level 5!', game_name)

        # Game-specific victory achievements
        if game_stats.get('victories', 0) >= 5:
            add_achievement(stats, f'{game_name.upper()}_WIN_5', f'5 {game_display_name} Wins!', game_name)
        if game_stats.get('victories', 0) >= 10:
            add_achievement(stats, f'{game_name.upper()}_WIN_10', f'10 {game_display_name} Wins!', game_name)

        # Game-specific streak achievements
        if game_stats.get('current_streak', 0) >= 3:
            add_achievement(stats, f'{game_name.upper()}_STREAK_3', f'3-Game {game_display_name} Streak!', game_name)
