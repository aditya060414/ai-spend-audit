import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
