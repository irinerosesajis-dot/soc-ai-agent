import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const investigateIOC = async (ioc) => {
  try {
    const response = await api.post('/investigate', { ioc });
    return response.data;
  } catch (error) {
    console.error('Error investigating IOC:', error);
    throw error;
  }
};

export default api;
