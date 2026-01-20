from mongoengine import Document, StringField, IntField, FloatField, ListField, EmbeddedDocument, EmbeddedDocumentField, DateTimeField, BooleanField
from datetime import datetime


class OrderItem(EmbeddedDocument):
    """Embedded document for order items"""
    medicine_id = StringField(required=True)
    name = StringField(required=True)
    price = FloatField(required=True)
    quantity = IntField(required=True)
    image = StringField()
    requires_prescription = BooleanField(default=False)


class OrderAddress(EmbeddedDocument):
    """Embedded document for delivery address"""
    full_name = StringField(required=True)
    phone = StringField(required=True)
    address_line1 = StringField(required=True)
    address_line2 = StringField()
    city = StringField(required=True)
    state = StringField(required=True)
    pincode = StringField(required=True)
    address_type = StringField(default="home")  # home, work, other


class Order(Document):
    """Order model for storing user orders"""
    order_id = StringField(required=True, unique=True)
    user_id = StringField(required=True)
    items = ListField(EmbeddedDocumentField(OrderItem), required=True)
    delivery_address = EmbeddedDocumentField(OrderAddress, required=True)
    subtotal = FloatField(required=True)
    delivery_charges = FloatField(default=0)
    total = FloatField(required=True)
    status = StringField(default="Pending")  # Pending, Confirmed, Processing, Shipped, In Transit, Delivered, Cancelled
    payment_method = StringField(default="COD")  # COD, Online
    payment_status = StringField(default="Pending")  # Pending, Paid, Failed, Refunded
    prescription_uploaded = BooleanField(default=False)
    prescription_url = StringField()
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    estimated_delivery = StringField(default="2-3 business days")
    tracking_number = StringField()
    
    meta = {
        'collection': 'orders',
        'indexes': ['user_id', 'order_id', 'status', 'created_at'],
        'ordering': ['-created_at']
    }
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'order_id': self.order_id,
            'user_id': self.user_id,
            'items': [
                {
                    'medicine_id': item.medicine_id,
                    'name': item.name,
                    'price': item.price,
                    'quantity': item.quantity,
                    'image': item.image,
                    'requires_prescription': item.requires_prescription
                }
                for item in self.items
            ],
            'delivery_address': {
                'full_name': self.delivery_address.full_name,
                'phone': self.delivery_address.phone,
                'address_line1': self.delivery_address.address_line1,
                'address_line2': self.delivery_address.address_line2,
                'city': self.delivery_address.city,
                'state': self.delivery_address.state,
                'pincode': self.delivery_address.pincode,
                'address_type': self.delivery_address.address_type
            } if self.delivery_address else None,
            'subtotal': self.subtotal,
            'delivery_charges': self.delivery_charges,
            'total': self.total,
            'status': self.status,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'prescription_uploaded': self.prescription_uploaded,
            'prescription_url': self.prescription_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'estimated_delivery': self.estimated_delivery,
            'tracking_number': self.tracking_number
        }
