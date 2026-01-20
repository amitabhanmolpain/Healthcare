import axios from 'axios';

const API_BASE_URL = '/api/profile';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const profileAPI = {
  getPersonalInfo: async () => {
    const response = await apiClient.get('/personal');
    return response.data;
  },
  updatePersonalInfo: async (data) => {
    const response = await apiClient.put('/personal', data);
    return response.data;
  },
  getMedicalHistory: async () => {
    const response = await apiClient.get('/medical');
    return response.data;
  },
  updateMedicalHistory: async (data) => {
    const response = await apiClient.put('/medical', data);
    return response.data;
  },
  getSecuritySettings: async () => {
    const response = await apiClient.get('/security');
    return response.data;
  },
  updateSecuritySettings: async (data) => {
    const response = await apiClient.put('/security', data);
    return response.data;
  }
};
