import axios from 'axios';

// Production backend URL — local dev uses localhost:3000
const BASE_URL = import.meta.env.VITE_API_URL 
  || (import.meta.env.DEV ? 'http://localhost:3000' : 'https://lm-arena-4.onrender.com');

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
