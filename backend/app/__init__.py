from flask import Flask
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from mongoengine import connect
from app.config import Config

bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Connect to MongoDB
    connect(host=app.config['MONGO_URI'])
    
    # Register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.doctor_routes import doctor_bp
    from app.routes.appointment_routes import appointment_bp
    from app.routes.medicine_routes import medicine_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(doctor_bp)
    app.register_blueprint(appointment_bp)
    app.register_blueprint(medicine_bp)
    
    return app
