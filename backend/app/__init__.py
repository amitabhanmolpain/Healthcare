from flask import Flask
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_socketio import SocketIO
from mongoengine import connect
from app.config import Config

bcrypt = Bcrypt()
jwt = JWTManager()
socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    # Initialize SocketIO with CORS
    socketio.init_app(app, 
                     cors_allowed_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
                     async_mode='threading')
    
    # Configure CORS - Allow frontend origin
    CORS(app, 
         resources={
             r"/*": {
                 "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
                 "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
                 "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
                 "supports_credentials": True,
                 "expose_headers": ["Content-Type", "Authorization"],
                 "max_age": 3600
             }
         })
    
    # Add after_request handler for additional CORS headers
    @app.after_request
    def after_request(response):
        origin = 'http://localhost:5173'
        response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    # Connect to MongoDB
    connect(host=app.config['MONGO_URI'])
    
    # Register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.doctor_routes import doctor_bp
    from app.routes.appointment_routes import appointment_bp
    from app.routes.medicine_routes import medicine_bp
    from app.routes.admin_routes import admin_bp
    from app.routes.cart_routes import cart_bp
    from app.routes.order_routes import order_bp
    from app.routes.address_routes import address_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(doctor_bp)
    app.register_blueprint(appointment_bp)
    app.register_blueprint(medicine_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(address_bp)
    
    return app
