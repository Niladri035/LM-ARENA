import axios from 'axios';

// Centralized API base URL — set VITE_API_URL in Render dashboard for production
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
