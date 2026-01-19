from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required
from app.controllers.medicine_controller import (
    get_all_medicines,
    get_medicine_by_id,
    get_medicines_by_category,
    search_medicines,
    get_prescription_medicines,
    get_in_stock_medicines
)

medicine_bp = Blueprint('medicine', __name__)
api = Api(medicine_bp)

class MedicineList(Resource):
    """Get all medicines"""
    
    def get(self):
        return get_all_medicines()

class MedicineDetail(Resource):
    """Get specific medicine by ID"""
    
    def get(self, medicine_id):
        return get_medicine_by_id(medicine_id)

class MedicinesByCategory(Resource):
    """Get medicines by category"""
    
    def get(self, category):
        return get_medicines_by_category(category)

class MedicineSearch(Resource):
    """Search medicines by name or description"""
    
    def get(self):
        query = request.args.get('q', '')
        if not query:
            return {'success': False, 'message': 'Search query is required'}, 400
        return search_medicines(query)

class PrescriptionMedicines(Resource):
    """Get all medicines requiring prescription"""
    
    def get(self):
        return get_prescription_medicines()

class InStockMedicines(Resource):
    """Get all in-stock medicines"""
    
    def get(self):
        return get_in_stock_medicines()

# Register resources
api.add_resource(MedicineList, '/medicines')
api.add_resource(MedicineDetail, '/medicines/<string:medicine_id>')
api.add_resource(MedicinesByCategory, '/medicines/category/<string:category>')
api.add_resource(MedicineSearch, '/medicines/search')
api.add_resource(PrescriptionMedicines, '/medicines/prescription-required')
api.add_resource(InStockMedicines, '/medicines/in-stock')
