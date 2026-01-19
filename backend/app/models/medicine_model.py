from mongoengine import Document, StringField, IntField, FloatField, BooleanField

class Medicine(Document):
    """Medicine model for storing medication information"""
    
    medicine_id = StringField(required=True, unique=True)
    name = StringField(required=True)
    category = StringField(required=True)
    price = IntField(required=True)
    description = StringField(required=True)
    image = StringField(required=True)
    requires_prescription = BooleanField(default=False)
    in_stock = BooleanField(default=True)
    rating = FloatField(default=0.0)
    reviews = IntField(default=0)
    
    meta = {
        'collection': 'medicines',
        'indexes': ['medicine_id', 'category', 'name']
    }
    
    def to_dict(self):
        """Convert medicine document to dictionary"""
        return {
            'id': self.medicine_id,
            'medicine_id': self.medicine_id,
            'name': self.name,
            'category': self.category,
            'price': self.price,
            'description': self.description,
            'image': self.image,
            'requiresPrescription': self.requires_prescription,
            'inStock': self.in_stock,
            'rating': self.rating,
            'reviews': self.reviews
        }
