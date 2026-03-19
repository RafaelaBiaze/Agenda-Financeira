import axios from 'axios';

const api = axios.create({
  // A mágica está aqui: como o Nginx cuida de tudo na porta 80,
  // basta dizer que a base das nossas chamadas é '/api'.
  // O Nginx vai ver isso e repassar para o seu Node.js automaticamente.
  baseURL: '/api',
});

// Opcional: Este "interceptor" é ótimo para o seu TCC. 
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