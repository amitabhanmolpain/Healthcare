from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.address_controller import (
    get_user_addresses,
    get_address_by_id,
    get_default_address,
    create_address,
    update_address,
    set_default_address,
    delete_address
)

address_bp = Blueprint('address', __name__, url_prefix='/api')
api = Api(address_bp)


class AddressListResource(Resource):
    """Get all addresses and create new address"""
    
    @jwt_required()
    def get(self):
        """Get all user addresses"""
        user_id = get_jwt_identity()
        return get_user_addresses(user_id)
    
    @jwt_required()
    def post(self):
        """Create new address"""
        user_id = get_jwt_identity()
        data = request.get_json()
        return create_address(user_id, data)


class AddressDetailResource(Resource):
    """Get, update, or delete specific address"""
    
    @jwt_required()
    def get(self, address_id):
        """Get address details"""
        user_id = get_jwt_identity()
        return get_address_by_id(user_id, address_id)
    
    @jwt_required()
    def put(self, address_id):
        """Update address"""
        user_id = get_jwt_identity()
        data = request.get_json()
        return update_address(user_id, address_id, data)
    
    @jwt_required()
    def delete(self, address_id):
        """Delete address"""
        user_id = get_jwt_identity()
        return delete_address(user_id, address_id)


class DefaultAddressResource(Resource):
    """Get and set default address"""
    
    @jwt_required()
    def get(self):
        """Get default address"""
        user_id = get_jwt_identity()
        return get_default_address(user_id)


class SetDefaultAddressResource(Resource):
    """Set address as default"""
    
    @jwt_required()
    def post(self, address_id):
        """Set address as default"""
        user_id = get_jwt_identity()
        return set_default_address(user_id, address_id)


# Register resources
api.add_resource(AddressListResource, '/addresses')
api.add_resource(AddressDetailResource, '/addresses/<string:address_id>')
api.add_resource(DefaultAddressResource, '/addresses/default')
api.add_resource(SetDefaultAddressResource, '/addresses/<string:address_id>/set-default')
