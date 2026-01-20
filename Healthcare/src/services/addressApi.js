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

// Address API endpoints
export const addressAPI = {
  // Get all user addresses
  getAddresses: async () => {
    const response = await apiClient.get('/addresses');
    return response.data;
  },

  // Get specific address by ID
  getAddressById: async (addressId) => {
    const response = await apiClient.get(`/addresses/${addressId}`);
    return response.data;
  },

  // Get default address
  getDefaultAddress: async () => {
    const response = await apiClient.get('/addresses/default');
    return response.data;
  },

  // Create new address
  createAddress: async (addressData) => {
    const response = await apiClient.post('/addresses', {
      full_name: addressData.fullName,
      phone: addressData.phone,
      address_line1: addressData.addressLine1,
      address_line2: addressData.addressLine2 || '',
      city: addressData.city,
      state: addressData.state,
      pincode: addressData.pincode,
      address_type: addressData.addressType || 'home',
      is_default: addressData.isDefault || false
    });
    return response.data;
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    const response = await apiClient.put(`/addresses/${addressId}`, {
      full_name: addressData.fullName,
      phone: addressData.phone,
      address_line1: addressData.addressLine1,
      address_line2: addressData.addressLine2 || '',
      city: addressData.city,
      state: addressData.state,
      pincode: addressData.pincode,
      address_type: addressData.addressType || 'home'
    });
    return response.data;
  },

  // Set address as default
  setDefaultAddress: async (addressId) => {
    const response = await apiClient.post(`/addresses/${addressId}/set-default`);
    return response.data;
  },

  // Delete address
  deleteAddress: async (addressId) => {
    const response = await apiClient.delete(`/addresses/${addressId}`);
    return response.data;
  }
};

export default addressAPI;
