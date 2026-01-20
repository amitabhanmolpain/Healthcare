from flask import jsonify
from app.models.order_model import Order, OrderItem, OrderAddress
from app.models.cart_model import Cart
from datetime import datetime
import uuid


def generate_order_id():
    """Generate unique order ID"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    unique_id = str(uuid.uuid4())[:6].upper()
    return f"ORD{timestamp}{unique_id}"


def get_user_orders(user_id):
    """Get all orders for a user"""
    try:
        orders = Order.objects(user_id=user_id).order_by('-created_at')
        
        return {
            'success': True,
            'orders': [order.to_dict() for order in orders],
            'count': len(orders)
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def get_order_by_id(user_id, order_id):
    """Get specific order by ID"""
    try:
        order = Order.objects(user_id=user_id, order_id=order_id).first()
        
        if not order:
            return {'success': False, 'message': 'Order not found'}, 404
        
        return {
            'success': True,
            'order': order.to_dict()
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def create_order(user_id, data):
    """Create a new order"""
    try:
        # Validate required fields
        if not data.get('items') or len(data.get('items', [])) == 0:
            return {'success': False, 'message': 'Order must contain at least one item'}, 400
        
        if not data.get('delivery_address'):
            return {'success': False, 'message': 'Delivery address is required'}, 400
        
        # Create order items
        order_items = []
        for item in data.get('items', []):
            order_item = OrderItem(
                medicine_id=item.get('medicine_id', item.get('id', '')),
                name=item.get('name'),
                price=item.get('price'),
                quantity=item.get('quantity'),
                image=item.get('image'),
                requires_prescription=item.get('requires_prescription', item.get('requiresPrescription', False))
            )
            order_items.append(order_item)
        
        # Create delivery address
        addr_data = data.get('delivery_address', {})
        delivery_address = OrderAddress(
            full_name=addr_data.get('full_name', addr_data.get('fullName', '')),
            phone=addr_data.get('phone', ''),
            address_line1=addr_data.get('address_line1', addr_data.get('addressLine1', '')),
            address_line2=addr_data.get('address_line2', addr_data.get('addressLine2', '')),
            city=addr_data.get('city', ''),
            state=addr_data.get('state', ''),
            pincode=addr_data.get('pincode', ''),
            address_type=addr_data.get('address_type', addr_data.get('addressType', 'home'))
        )
        
        # Calculate totals
        subtotal = sum(item.price * item.quantity for item in order_items)
        delivery_charges = 0 if subtotal >= 4000 else 50
        total = subtotal + delivery_charges
        
        # Create order
        order = Order(
            order_id=generate_order_id(),
            user_id=user_id,
            items=order_items,
            delivery_address=delivery_address,
            subtotal=subtotal,
            delivery_charges=delivery_charges,
            total=total,
            status="Confirmed",
            payment_method=data.get('payment_method', 'COD'),
            payment_status="Pending" if data.get('payment_method', 'COD') == 'COD' else "Paid",
            prescription_uploaded=data.get('prescription_uploaded', False),
            prescription_url=data.get('prescription_url')
        )
        order.save()
        
        # Clear user's cart after successful order
        cart = Cart.objects(user_id=user_id).first()
        if cart:
            cart.items = []
            cart.updated_at = datetime.utcnow()
            cart.save()
        
        return {
            'success': True,
            'message': 'Order placed successfully',
            'order': order.to_dict()
        }, 201
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def update_order_status(user_id, order_id, data):
    """Update order status"""
    try:
        order = Order.objects(user_id=user_id, order_id=order_id).first()
        
        if not order:
            return {'success': False, 'message': 'Order not found'}, 404
        
        valid_statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'In Transit', 'Delivered', 'Cancelled']
        new_status = data.get('status')
        
        if new_status and new_status not in valid_statuses:
            return {'success': False, 'message': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}, 400
        
        if new_status:
            order.status = new_status
        
        if data.get('tracking_number'):
            order.tracking_number = data.get('tracking_number')
        
        if data.get('payment_status'):
            order.payment_status = data.get('payment_status')
        
        order.updated_at = datetime.utcnow()
        order.save()
        
        return {
            'success': True,
            'message': 'Order updated',
            'order': order.to_dict()
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def cancel_order(user_id, order_id):
    """Cancel an order"""
    try:
        order = Order.objects(user_id=user_id, order_id=order_id).first()
        
        if not order:
            return {'success': False, 'message': 'Order not found'}, 404
        
        # Can only cancel if not already shipped/delivered
        if order.status in ['Shipped', 'In Transit', 'Delivered']:
            return {'success': False, 'message': f'Cannot cancel order with status: {order.status}'}, 400
        
        order.status = 'Cancelled'
        order.updated_at = datetime.utcnow()
        order.save()
        
        return {
            'success': True,
            'message': 'Order cancelled successfully',
            'order': order.to_dict()
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def reorder(user_id, order_id):
    """Add items from a previous order to cart"""
    try:
        order = Order.objects(user_id=user_id, order_id=order_id).first()
        
        if not order:
            return {'success': False, 'message': 'Order not found'}, 404
        
        # Get or create cart
        cart = Cart.objects(user_id=user_id).first()
        if not cart:
            from app.models.cart_model import CartItem
            cart = Cart(user_id=user_id, items=[])
        
        # Add order items to cart
        from app.models.cart_model import CartItem
        for order_item in order.items:
            # Check if item already exists
            existing = False
            for cart_item in cart.items:
                if cart_item.medicine_id == order_item.medicine_id:
                    cart_item.quantity += order_item.quantity
                    existing = True
                    break
            
            if not existing:
                new_item = CartItem(
                    medicine_id=order_item.medicine_id,
                    name=order_item.name,
                    price=order_item.price,
                    quantity=order_item.quantity,
                    image=order_item.image,
                    requires_prescription=order_item.requires_prescription
                )
                cart.items.append(new_item)
        
        cart.updated_at = datetime.utcnow()
        cart.save()
        
        return {
            'success': True,
            'message': 'Items added to cart',
            'cart': cart.to_dict()
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500
