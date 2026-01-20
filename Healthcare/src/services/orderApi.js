import axios from 'axios';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Order API endpoints
export const orderAPI = {
  // Get all user orders
  getOrders: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  // Get specific order by ID
  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // Create new order
  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders', {
      items: orderData.items.map(item => ({
        medicine_id: item.id?.toString() || item.medicine_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        requires_prescription: item.requiresPrescription || item.requires_prescription || false
      })),
      delivery_address: {
        full_name: orderData.deliveryAddress.fullName,
        phone: orderData.deliveryAddress.phone,
        address_line1: orderData.deliveryAddress.addressLine1,
        address_line2: orderData.deliveryAddress.addressLine2 || '',
        city: orderData.deliveryAddress.city,
        state: orderData.deliveryAddress.state,
        pincode: orderData.deliveryAddress.pincode,
        address_type: orderData.deliveryAddress.addressType || 'home'
      },
      payment_method: orderData.paymentMethod || 'COD',
      prescription_uploaded: orderData.prescriptionUploaded || false,
      prescription_url: orderData.prescriptionUrl || null
    });
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId, status, trackingNumber = null) => {
    const data = { status };
    if (trackingNumber) data.tracking_number = trackingNumber;
    const response = await apiClient.put(`/orders/${orderId}`, data);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    const response = await apiClient.post(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Reorder - add items from previous order to cart
  reorder: async (orderId) => {
    const response = await apiClient.post(`/orders/${orderId}/reorder`);
    return response.data;
  }
};

export default orderAPI;
