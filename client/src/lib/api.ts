import axios from 'axios';

// custom api
const api = axios.create({
  baseURL: 'https://ai-spend-audit-lm5x.onrender.com',
  timeout: 15000,
});

export default api;
