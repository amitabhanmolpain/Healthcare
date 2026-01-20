from mongoengine import Document, StringField, IntField, FloatField, ListField, EmbeddedDocument, EmbeddedDocumentField, DateTimeField, BooleanField, ReferenceField
from datetime import datetime


class CartItem(EmbeddedDocument):
    """Embedded document for cart items"""
    medicine_id = StringField(required=True)
    name = StringField(required=True)
    price = FloatField(required=True)
    quantity = IntField(required=True, default=1)
    image = StringField()
    description = StringField()
    requires_prescription = BooleanField(default=False)
    added_at = DateTimeField(default=datetime.utcnow)


class Cart(Document):
    """Cart model for storing user's shopping cart"""
    user_id = StringField(required=True, unique=True)
    items = ListField(EmbeddedDocumentField(CartItem), default=[])
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'carts',
        'indexes': ['user_id']
    }
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': self.user_id,
            'items': [
                {
                    'medicine_id': item.medicine_id,
                    'name': item.name,
                    'price': item.price,
                    'quantity': item.quantity,
                    'image': item.image,
                    'description': item.description,
                    'requires_prescription': item.requires_prescription,
                    'added_at': item.added_at.isoformat() if item.added_at else None
                }
                for item in self.items
            ],
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'total_items': sum(item.quantity for item in self.items),
            'total_price': sum(item.price * item.quantity for item in self.items)
        }
