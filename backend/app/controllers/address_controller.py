from flask import jsonify
from app.models.address_model import Address
from datetime import datetime


def get_user_addresses(user_id):
    """Get all addresses for a user"""
    try:
        addresses = Address.objects(user_id=user_id).order_by('-is_default', '-created_at')
        
        return {
            'success': True,
            'addresses': [addr.to_dict() for addr in addresses],
            'count': len(addresses)
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def get_address_by_id(user_id, address_id):
    """Get specific address by ID"""
    try:
        address = Address.objects(id=address_id, user_id=user_id).first()
        
        if not address:
            return {'success': False, 'message': 'Address not found'}, 404
        
        return {
            'success': True,
            'address': address.to_dict()
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def get_default_address(user_id):
    """Get user's default address"""
    try:
        address = Address.objects(user_id=user_id, is_default=True).first()
        
        if not address:
            # Return first address if no default set
            address = Address.objects(user_id=user_id).first()
        
        if not address:
            return {
                'success': True,
                'address': None,
                'message': 'No addresses found'
            }, 200
        
        return {
            'success': True,
            'address': address.to_dict()
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def create_address(user_id, data):
    """Create a new address"""
    try:
        # Validate required fields
        required_fields = ['full_name', 'phone', 'address_line1', 'city', 'state', 'pincode']
        # Also check camelCase versions
        camel_fields = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode']
        
        for snake, camel in zip(required_fields, camel_fields):
            if not data.get(snake) and not data.get(camel):
                return {'success': False, 'message': f'{snake} is required'}, 400
        
        # If this is the first address or set as default, unset other defaults
        is_default = data.get('is_default', data.get('isDefault', False))
        if is_default:
            Address.objects(user_id=user_id, is_default=True).update(set__is_default=False)
        
        # If this is the first address, make it default
        existing_count = Address.objects(user_id=user_id).count()
        if existing_count == 0:
            is_default = True
        
        address = Address(
            user_id=user_id,
            full_name=data.get('full_name', data.get('fullName', '')),
            phone=data.get('phone', ''),
            address_line1=data.get('address_line1', data.get('addressLine1', '')),
            address_line2=data.get('address_line2', data.get('addressLine2', '')),
            city=data.get('city', ''),
            state=data.get('state', ''),
            pincode=data.get('pincode', ''),
            address_type=data.get('address_type', data.get('addressType', 'home')),
            is_default=is_default
        )
        address.save()
        
        return {
            'success': True,
            'message': 'Address created successfully',
            'address': address.to_dict()
        }, 201
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def update_address(user_id, address_id, data):
    """Update an existing address"""
    try:
        address = Address.objects(id=address_id, user_id=user_id).first()
        
        if not address:
            return {'success': False, 'message': 'Address not found'}, 404
        
        # Update fields
        if data.get('full_name') or data.get('fullName'):
            address.full_name = data.get('full_name', data.get('fullName'))
        if data.get('phone'):
            address.phone = data.get('phone')
        if data.get('address_line1') or data.get('addressLine1'):
            address.address_line1 = data.get('address_line1', data.get('addressLine1'))
        if data.get('address_line2') is not None or data.get('addressLine2') is not None:
            address.address_line2 = data.get('address_line2', data.get('addressLine2', ''))
        if data.get('city'):
            address.city = data.get('city')
        if data.get('state'):
            address.state = data.get('state')
        if data.get('pincode'):
            address.pincode = data.get('pincode')
        if data.get('address_type') or data.get('addressType'):
            address.address_type = data.get('address_type', data.get('addressType'))
        
        address.updated_at = datetime.utcnow()
        address.save()
        
        return {
            'success': True,
            'message': 'Address updated successfully',
            'address': address.to_dict()
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def set_default_address(user_id, address_id):
    """Set an address as the default"""
    try:
        address = Address.objects(id=address_id, user_id=user_id).first()
        
        if not address:
            return {'success': False, 'message': 'Address not found'}, 404
        
        # Unset other defaults
        Address.objects(user_id=user_id, is_default=True).update(set__is_default=False)
        
        # Set this as default
        address.is_default = True
        address.updated_at = datetime.utcnow()
        address.save()
        
        return {
            'success': True,
            'message': 'Default address updated',
            'address': address.to_dict()
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def delete_address(user_id, address_id):
    """Delete an address"""
    try:
        address = Address.objects(id=address_id, user_id=user_id).first()
        
        if not address:
            return {'success': False, 'message': 'Address not found'}, 404
        
        was_default = address.is_default
        address.delete()
        
        # If deleted address was default, set another as default
        if was_default:
            remaining = Address.objects(user_id=user_id).first()
            if remaining:
                remaining.is_default = True
                remaining.save()
        
        return {
            'success': True,
            'message': 'Address deleted successfully'
        }, 200
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500
