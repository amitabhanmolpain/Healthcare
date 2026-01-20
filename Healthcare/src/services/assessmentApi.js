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

export const assessmentAPI = {
  // Get all assessments for user
  getAssessments: async () => {
    const response = await apiClient.get('/assessments');
    return response.data;
  },

  // Get specific assessment
  getAssessmentById: async (assessmentId) => {
    const response = await apiClient.get(`/assessments/${assessmentId}`);
    return response.data;
  },

  // Create new assessment
  createAssessment: async (assessmentData) => {
    const response = await apiClient.post('/assessments', assessmentData);
    return response.data;
  },

  // Update assessment
  updateAssessment: async (assessmentId, assessmentData) => {
    const response = await apiClient.put(`/assessments/${assessmentId}`, assessmentData);
    return response.data;
  },

  // Delete assessment
  deleteAssessment: async (assessmentId) => {
    const response = await apiClient.delete(`/assessments/${assessmentId}`);
    return response.data;
  }
};
