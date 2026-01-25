from app.controllers.player_stats_controller import player_stats_bp

def register_player_stats_routes(app):
    app.register_blueprint(player_stats_bp)
