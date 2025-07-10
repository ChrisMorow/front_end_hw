import axios from 'axios';

// Get API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Books API
export const booksApi = {
  getAll: () => api.get('/books/'),
  getById: (id) => api.get(`/books/${id}/`),
  create: (data) => api.post('/books/', data),
  update: (id, data) => api.put(`/books/${id}/`, data),
  delete: (id) => api.delete(`/books/${id}/`),
  addReview: (id, data) => api.post(`/books/${id}/add_review/`, data),
};

// Reviews API
export const reviewsApi = {
  getAll: () => api.get('/reviews/'),
  getById: (id) => api.get(`/reviews/${id}/`),
  create: (data) => api.post('/reviews/', data),
  update: (id, data) => api.put(`/reviews/${id}/`, data),
  delete: (id) => api.delete(`/reviews/${id}/`),
};

// Users API
export const usersApi = {
  getAll: () => api.get('/users/'),
  getById: (id) => api.get(`/users/${id}/`),
  create: (data) => api.post('/users/', data),
  update: (id, data) => api.put(`/users/${id}/`, data),
  delete: (id) => api.delete(`/users/${id}/`),
  login: (id) => api.post('/users/login/', { id }),
};

// Rentals API
export const rentalsApi = {
  getAll: () => api.get('/rentals/'),
  getById: (id) => api.get(`/rentals/${id}/`),
  create: (data) => api.post('/rentals/', data),
  update: (id, data) => api.put(`/rentals/${id}/`, data),
  delete: (id) => api.delete(`/rentals/${id}/`),
  returnBook: (id) => api.post(`/rentals/${id}/return_book/`),
  extendRental: (id, days) => api.post(`/rentals/${id}/extend_rental/`, { days }),
};

export default {
  books: booksApi,
  reviews: reviewsApi,
  users: usersApi,
  rentals: rentalsApi,
};