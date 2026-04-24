import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (userData) => apiClient.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('jwtToken');
    return Promise.resolve();
  },
};


export const userAPI = {
  getProfile: (userId) => apiClient.get(`/users/${userId}`),
  getAllUsers: (page = 0, size = 20) => apiClient.get(`/users?page=${page}&size=${size}`),
  updateProfile: (userId, userData) => apiClient.put(`/users/${userId}`, userData),
};


export const resourceAPI = {
  getAllResources: () => apiClient.get('/resources'),
  getResourceById: (id) => apiClient.get(`/resources/${id}`),
  searchResources: (params) => apiClient.get('/resources/search', { params }),
  createResource: (resourceData) => apiClient.post('/resources', resourceData),
  updateResource: (id, resourceData) => apiClient.put(`/resources/${id}`, resourceData),
  deleteResource: (id) => apiClient.delete(`/resources/${id}`),
};

export const facilityAPI = {
  getAllFacilities: () => apiClient.get('/facilities'),
  getFacilityDetails: (facilityId) => apiClient.get(`/facilities/${facilityId}`),
  bookFacility: (facilityId, bookingData) => apiClient.post(`/facilities/${facilityId}/book`, bookingData),
  getFacilityBookings: (facilityId) => apiClient.get(`/facilities/${facilityId}/bookings`),
};


export const eventAPI = {
  getAllEvents: () => apiClient.get('/events'),
  getEventDetails: (eventId) => apiClient.get(`/events/${eventId}`),
  registerForEvent: (eventId) => apiClient.post(`/events/${eventId}/register`),
  getUserEvents: () => apiClient.get('/events/my-registrations'),
};


export const dashboardAPI = {
  getStatistics: () => apiClient.get('/dashboard/stats'),
};

export default apiClient;
