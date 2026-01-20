from flask import jsonify
from app.models.cart_model import Cart, CartItem
from datetime import datetime


def get_cart(user_id):
    """Get user's cart"""
    try:
        cart = Cart.objects(user_id=user_id).first()
        if not cart:
            # Return empty cart
            return {
                'success': True,
                'cart': {
                    'user_id': user_id,
                    'items': [],
                    'total_items': 0,
                    'total_price': 0
                }
            }, 200
        
        return {
            'success': True,
            'cart': cart.to_dict()
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def add_to_cart(user_id, data):
    """Add item to cart"""
    try:
        cart = Cart.objects(user_id=user_id).first()
        
        if not cart:
            cart = Cart(user_id=user_id, items=[])
        
        # Check if item already exists in cart
        existing_item = None
        for item in cart.items:
            if item.medicine_id == data.get('medicine_id'):
                existing_item = item
                break
        
        if existing_item:
            # Update quantity
            existing_item.quantity += data.get('quantity', 1)
        else:
            # Add new item
            new_item = CartItem(
                medicine_id=data.get('medicine_id'),
                name=data.get('name'),
                price=data.get('price'),
                quantity=data.get('quantity', 1),
                image=data.get('image'),
                description=data.get('description'),
                requires_prescription=data.get('requires_prescription', False)
            )
            cart.items.append(new_item)
        
        cart.updated_at = datetime.utcnow()
        cart.save()
        
        return {
            'success': True,
            'message': 'Item added to cart',
            'cart': cart.to_dict()
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def update_cart_item(user_id, medicine_id, data):
    """Update cart item quantity"""
    try:
        cart = Cart.objects(user_id=user_id).first()
        
        if not cart:
            return {'success': False, 'message': 'Cart not found'}, 404
        
        item_found = False
        for item in cart.items:
            if item.medicine_id == medicine_id:
                item.quantity = data.get('quantity', item.quantity)
                item_found = True
                break
        
        if not item_found:
            return {'success': False, 'message': 'Item not found in cart'}, 404
        
        cart.updated_at = datetime.utcnow()
        cart.save()
        
        return {
            'success': True,
            'message': 'Cart updated',
            'cart': cart.to_dict()
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def remove_from_cart(user_id, medicine_id):
    """Remove item from cart"""
    try:
        cart = Cart.objects(user_id=user_id).first()
        
        if not cart:
            return {'success': False, 'message': 'Cart not found'}, 404
        
        original_length = len(cart.items)
        cart.items = [item for item in cart.items if item.medicine_id != medicine_id]
        
        if len(cart.items) == original_length:
            return {'success': False, 'message': 'Item not found in cart'}, 404
        
        cart.updated_at = datetime.utcnow()
        cart.save()
        
        return {
            'success': True,
            'message': 'Item removed from cart',
            'cart': cart.to_dict()
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def clear_cart(user_id):
    """Clear all items from cart"""
    try:
        cart = Cart.objects(user_id=user_id).first()
        
        if cart:
            cart.items = []
            cart.updated_at = datetime.utcnow()
            cart.save()
        
        return {
            'success': True,
            'message': 'Cart cleared'
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500
