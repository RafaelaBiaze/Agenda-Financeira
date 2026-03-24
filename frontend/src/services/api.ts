import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Ele verifica se existe um token salvo no navegador e, se sim,
// coloca ele no cabeçalho de toda requisição automaticamente.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@SolEncantado:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;