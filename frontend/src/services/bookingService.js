import axios from 'axios';

const API_BASE_URL = '/api/v1/bookings';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('hub_user');
  if (savedUser) {
    const { token } = JSON.parse(savedUser);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookingService = {
  createBooking: (data) => api.post('', data),
  
  getMyBookings: () => api.get('/my'),
  
  getBookingById: (id) => api.get(`/${id}`),
  
  getAllBookings: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`?${params}`);
  },
  
  updateStatus: (id, statusData) => api.patch(`/${id}/status`, statusData),
  
  cancelBooking: (id) => api.patch(`/${id}/cancel`),
};

// Resource service stub
export const resourceService = {
  getAllResources: () => axios.get('/api/resources'),
};
