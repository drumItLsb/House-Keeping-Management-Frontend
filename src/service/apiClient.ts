import axios from 'axios';

import { getAccessToken } from '../features/Login/LoginStorage';

export const API_BASE_URL = 'localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL.startsWith('http') ? API_BASE_URL : `http://${API_BASE_URL}`,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
