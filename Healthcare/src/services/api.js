import axios from 'axios';

// Create axios instance with default config
// Use /api prefix to let Vite proxy handle requests
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 422) {
      // Token expired, invalid, or unprocessable
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  setAuthData: (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
};

// Doctor API endpoints
export const doctorAPI = {
  getAllDoctors: async () => {
    const response = await apiClient.get('/doctors');
    return response.data;
  },

  getAllDoctorsIncludingInactive: async () => {
    const response = await apiClient.get('/doctors/all');
    return response.data;
  },

  getDashboardDoctors: async () => {
    const response = await apiClient.get('/doctors/dashboard');
    return response.data;
  },

  getDoctorById: async (doctorId) => {
    const response = await apiClient.get(`/doctors/${doctorId}`);
    return response.data;
  },

  getDoctorsBySpecialty: async (specialty) => {
    const response = await apiClient.get(`/doctors/specialty/${specialty}`);
    return response.data;
  },
};

// Appointment API endpoints
export const appointmentAPI = {
  createAppointment: async (appointmentData) => {
    const response = await apiClient.post('/appointments', appointmentData);
    return response.data;
  },

  getMyAppointments: async (status = null) => {
    const url = status ? `/appointments/my?status=${status}` : '/appointments/my';
    const response = await apiClient.get(url);
    return response.data;
  },

  getAppointmentById: async (appointmentId) => {
    const response = await apiClient.get(`/appointments/${appointmentId}`);
    return response.data;
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    const response = await apiClient.patch(`/appointments/${appointmentId}`, { status });
    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await apiClient.delete(`/appointments/${appointmentId}`);
    return response.data;
  },

  getAvailableSlots: async (doctorId, date) => {
    const response = await apiClient.get(`/appointments/available-slots/${doctorId}?date=${date}`);
    return response.data;
  },

  getUpcomingAppointments: async (days = 30) => {
    const response = await apiClient.get(`/appointments/upcoming?days=${days}`);
    return response.data;
  },
};

export default apiClient;
