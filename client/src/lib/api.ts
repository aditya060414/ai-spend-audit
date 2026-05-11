import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://ai-spend-audit-lm5x.onrender.com';


const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
