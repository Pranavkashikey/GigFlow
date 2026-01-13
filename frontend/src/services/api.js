import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

export const gigAPI = {
 getAll: (search) => api.get(`/gigs${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  create: (data) => api.post('/gigs', data),
  getMyGigs: () => api.get('/gigs/my-gigs'),
};

export const bidAPI = {
  create: (data) => api.post('/bids', data),
  getGigBids: (gigId) => api.get(`/bids/${gigId}`),
  hire: (bidId) => api.patch(`/bids/${bidId}/hire`),
};

export default api;
