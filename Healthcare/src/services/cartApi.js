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

// Cart API endpoints
export const cartAPI = {
  // Get user's cart
  getCart: async () => {
    const response = await apiClient.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (item) => {
    const response = await apiClient.post('/cart', {
      medicine_id: item.id?.toString() || item.medicine_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      image: item.image,
      description: item.description,
      requires_prescription: item.requiresPrescription || item.requires_prescription || false
    });
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (medicineId, quantity) => {
    const response = await apiClient.put(`/cart/${medicineId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (medicineId) => {
    const response = await apiClient.delete(`/cart/${medicineId}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await apiClient.delete('/cart');
    return response.data;
  }
};

export default cartAPI;
