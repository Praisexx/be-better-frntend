import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (email, password) =>
    api.post('/api/auth/register', { email, password }),

  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),

  getCurrentUser: () =>
    api.get('/api/auth/me'),
};

// Upload API
export const uploadAPI = {
  uploadCSV: (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/api/upload/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) onProgress(percentCompleted);
      },
    });
  },

  getQueueStatus: () =>
    api.get('/api/upload/queue-status'),
};

// Analysis API
export const analysisAPI = {
  getHistory: (limit = 10) =>
    api.get(`/api/analysis/history?limit=${limit}`),

  getAnalysis: (analysisId) =>
    api.get(`/api/analysis/${analysisId}`),

  getResults: (analysisId) =>
    api.get(`/api/analysis/${analysisId}/results`),

  downloadPDF: (analysisId) =>
    api.get(`/api/analysis/${analysisId}/download-pdf`, {
      responseType: 'blob',
    }),

  downloadPDFWithCharts: (analysisId, chartImages) =>
    api.post(`/api/analysis/${analysisId}/download-pdf-with-charts`,
      { chart_images: chartImages },
      { responseType: 'blob' }
    ),

  deleteAnalysis: (analysisId) =>
    api.delete(`/api/analysis/${analysisId}`),

  emailReport: (analysisId, email) =>
    api.post(`/api/analysis/${analysisId}/email`, { email }),
};

// Account API (OAuth Integration)
export const accountAPI = {
  getConnectedAccounts: () =>
    api.get('/api/accounts/connected'),

  initiateOAuth: (platform) =>
    api.post(`/api/accounts/oauth/initiate`, { platform }),

  handleOAuthCallback: (platform, code, state) =>
    api.post(`/api/accounts/oauth/callback`, { platform, code, state }),

  disconnectAccount: (accountId) =>
    api.delete(`/api/accounts/${accountId}`),

  syncAccount: (accountId) =>
    api.post(`/api/accounts/${accountId}/sync`),

  getAccountCampaigns: (accountId) =>
    api.get(`/api/accounts/${accountId}/campaigns`),
};

// Report Generation API
export const reportAPI = {
  generateFromAccount: (accountId, options = {}) =>
    api.post('/api/reports/generate', {
      source_type: 'account',
      account_id: accountId,
      ...options
    }),

  generateFromCSV: (analysisId) =>
    api.post('/api/reports/generate', {
      source_type: 'csv',
      analysis_id: analysisId
    }),

  getReportStatus: (reportId) =>
    api.get(`/api/reports/${reportId}/status`),
};

export default api;
