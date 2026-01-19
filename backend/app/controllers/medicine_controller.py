from app.models.medicine_model import Medicine
from flask import jsonify

def get_all_medicines():
    """Get all medicines"""
    try:
        medicines = Medicine.objects()
        return jsonify({
            'success': True,
            'medicines': [medicine.to_dict() for medicine in medicines],
            'count': len(medicines)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching medicines: {str(e)}'
        }), 500

def get_medicine_by_id(medicine_id):
    """Get a specific medicine by ID"""
    try:
        medicine = Medicine.objects(medicine_id=medicine_id).first()
        
        if not medicine:
            return jsonify({
                'success': False,
                'message': 'Medicine not found'
            }), 404
            
        return jsonify({
            'success': True,
            'medicine': medicine.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching medicine: {str(e)}'
        }), 500

def get_medicines_by_category(category):
    """Get medicines filtered by category"""
    try:
        medicines = Medicine.objects(category=category)
        
        return jsonify({
            'success': True,
            'medicines': [medicine.to_dict() for medicine in medicines],
            'count': len(medicines),
            'category': category
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching medicines by category: {str(e)}'
        }), 500

def search_medicines(query):
    """Search medicines by name or description"""
    try:
        # Case-insensitive search in name and description
        medicines = Medicine.objects(
            name__icontains=query
        ) | Medicine.objects(
            description__icontains=query
        )
        
        return jsonify({
            'success': True,
            'medicines': [medicine.to_dict() for medicine in medicines],
            'count': len(medicines),
            'query': query
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error searching medicines: {str(e)}'
        }), 500

def get_prescription_medicines():
    """Get all medicines that require prescription"""
    try:
        medicines = Medicine.objects(requires_prescription=True)
        
        return jsonify({
            'success': True,
            'medicines': [medicine.to_dict() for medicine in medicines],
            'count': len(medicines)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching prescription medicines: {str(e)}'
        }), 500

def get_in_stock_medicines():
    """Get all medicines that are in stock"""
    try:
        medicines = Medicine.objects(in_stock=True)
        
        return jsonify({
            'success': True,
            'medicines': [medicine.to_dict() for medicine in medicines],
            'count': len(medicines)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching in-stock medicines: {str(e)}'
        }), 500
