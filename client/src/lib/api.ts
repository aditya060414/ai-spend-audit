import axios from 'axios';

// custom api
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 15000,
});

export default api;
