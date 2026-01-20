from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.order_controller import (
    get_user_orders,
    get_order_by_id,
    create_order,
    update_order_status,
    cancel_order,
    reorder
)

order_bp = Blueprint('order', __name__, url_prefix='/api')
api = Api(order_bp)


class OrderListResource(Resource):
    """Get all orders and create new order"""
    
    @jwt_required()
    def get(self):
        """Get all user orders"""
        user_id = get_jwt_identity()
        return get_user_orders(user_id)
    
    @jwt_required()
    def post(self):
        """Create new order"""
        user_id = get_jwt_identity()
        data = request.get_json()
        return create_order(user_id, data)


class OrderDetailResource(Resource):
    """Get, update, or cancel specific order"""
    
    @jwt_required()
    def get(self, order_id):
        """Get order details"""
        user_id = get_jwt_identity()
        return get_order_by_id(user_id, order_id)
    
    @jwt_required()
    def put(self, order_id):
        """Update order status"""
        user_id = get_jwt_identity()
        data = request.get_json()
        return update_order_status(user_id, order_id, data)


class OrderCancelResource(Resource):
    """Cancel an order"""
    
    @jwt_required()
    def post(self, order_id):
        """Cancel order"""
        user_id = get_jwt_identity()
        return cancel_order(user_id, order_id)


class OrderReorderResource(Resource):
    """Reorder items from previous order"""
    
    @jwt_required()
    def post(self, order_id):
        """Add items from previous order to cart"""
        user_id = get_jwt_identity()
        return reorder(user_id, order_id)


# Register resources
api.add_resource(OrderListResource, '/orders')
api.add_resource(OrderDetailResource, '/orders/<string:order_id>')
api.add_resource(OrderCancelResource, '/orders/<string:order_id>/cancel')
api.add_resource(OrderReorderResource, '/orders/<string:order_id>/reorder')
