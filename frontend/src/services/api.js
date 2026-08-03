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

export const getHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

export const getHistoryById = async (id) => {
  try {
    const response = await api.get(`/history/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching history record by ID:', error);
    throw error;
  }
};

export const deleteHistoryRecord = async (id) => {
  try {
    const response = await api.delete(`/history/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting history record:', error);
    throw error;
  }
};

export const downloadPdfReport = async (investigationId, ioc = 'IOC') => {
  try {
    const response = await api.get(`/report/pdf/${investigationId}`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const safeIoc = (ioc || 'IOC').replace(/[^a-zA-Z0-9._-]/g, '_');
    link.setAttribute('download', `SOC_Incident_Report_${safeIoc}.pdf`);

    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF report:', error);
    throw error;
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export default api;



