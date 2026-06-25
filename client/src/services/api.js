import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically inject JWT Token if it exists in localstorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Authentication endpoints
export const authAPI = {
  login: (email, password) => API.post('/api/auth/login', { email, password }),
  register: (name, email, password, phone) => API.post('/api/auth/register', { name, email, password, phone }),
  getMe: () => API.get('/api/auth/me')
};
export const settingsAPI = {
  getSettings: () => API.get('/api/admin/public-settings')
};

// Bookings endpoints
export const bookingAPI = {
  getSlots: (date) => API.get(`/api/bookings/slots/${date}`),
  createBooking: (bookingData) => API.post('/api/bookings', bookingData),
  getMyBookings: () => API.get('/api/bookings'),
  cancelBooking: (id) => API.delete(`/api/bookings/${id}`),
  updateBooking: (id, bookingData) => API.put(`/api/bookings/${id}`, bookingData)
  
};



// Pricing endpoints
export const pricingAPI = {
  getPricing: () => API.get('/api/pricing'),
 updatePricing: (data) => API.post('/api/pricing', data),
};

// Gallery endpoints
export const galleryAPI = {
  getGallery: () => API.get('/api/gallery')
};

// Reviews endpoints
export const reviewAPI = {
  getReviews: () => API.get('/api/reviews'),
  submitReview: (reviewData) => API.post('/api/reviews', reviewData)
};

// Contact form endpoints
export const contactAPI = {
  submitInquiry: (contactData) => API.post('/api/contact', contactData)
};

// Admin panel endpoints
export const adminAPI = {
  getStats: () => API.get('/api/admin/stats'),
  getAllBookings: () => API.get('/api/admin/bookings'),
  getAllUsers: () => API.get('/api/admin/users'),
  updateBookingStatus: (id, status) => API.put(`/api/admin/bookings/${id}`, { status }),
  getAllReviews: () => API.get('/api/admin/reviews'),
  approveReview: (id, isApproved) => API.put(`/api/admin/reviews/${id}`, { isApproved }),
  getAllContacts: () => API.get('/api/admin/contacts'),
  markContactAsRead: (id) => API.put(`/api/admin/contacts/${id}`),
  deleteAllBookings: () => API.delete('/api/admin/bookings'),
  getSettings: () => API.get('/api/admin/settings'),

updateSettings: (settingsData) =>
  API.put('/api/admin/settings', settingsData),
};

export default API;
