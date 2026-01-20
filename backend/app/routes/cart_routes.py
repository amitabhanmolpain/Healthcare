from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.cart_controller import (
    get_cart,
    add_to_cart,
    update_cart_item,
    remove_from_cart,
    clear_cart
)

cart_bp = Blueprint('cart', __name__, url_prefix='/api')
api = Api(cart_bp)


class CartResource(Resource):
    """Get cart and add items to cart"""
    
    @jwt_required()
    def get(self):
        """Get user's cart"""
        user_id = get_jwt_identity()
        return get_cart(user_id)
    
    @jwt_required()
    def post(self):
        """Add item to cart"""
        user_id = get_jwt_identity()
        data = request.get_json()
        return add_to_cart(user_id, data)
    
    @jwt_required()
    def delete(self):
        """Clear entire cart"""
        user_id = get_jwt_identity()
        return clear_cart(user_id)


class CartItemResource(Resource):
    """Update or remove specific cart item"""
    
    @jwt_required()
    def put(self, medicine_id):
        """Update cart item quantity"""
        user_id = get_jwt_identity()
        data = request.get_json()
        return update_cart_item(user_id, medicine_id, data)
    
    @jwt_required()
    def delete(self, medicine_id):
        """Remove item from cart"""
        user_id = get_jwt_identity()
        return remove_from_cart(user_id, medicine_id)


# Register resources
api.add_resource(CartResource, '/cart')
api.add_resource(CartItemResource, '/cart/<string:medicine_id>')
